import { NextApiRequest, NextApiResponse } from 'next'
import {
  readFaucetData,
  writeFaucetData,
  isValidEthereumAddress,
  isAddressInCooldown,
  checkRateLimit,
  addRateLimitEntry,
  sendKASTokens,
  verifyRecaptcha,
  ClaimError,
  FAUCET_CONFIG,
} from './utils'

interface ClaimRequest {
  walletAddress: string
  captchaToken?: string
}

interface ClaimResponse {
  success: boolean
  message: string
  txHash?: string
  queuePosition?: number
  remainingTime?: number
  error?: ClaimError
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ClaimResponse>) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: {
        type: 'validation',
        message: 'Only POST requests are allowed',
      },
    })
  }

  try {
    const { walletAddress, captchaToken }: ClaimRequest = req.body

    // Validate request
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
        error: {
          type: 'validation',
          message: 'Wallet address is required',
        },
      })
    }

    // Validate Ethereum address format
    if (!isValidEthereumAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ethereum address format',
        error: {
          type: 'validation',
          message: 'Must be a valid Ethereum address (42 characters starting with 0x)',
        },
      })
    }

    // Verify captcha token
    if (captchaToken) {
      const isCaptchaValid = await verifyRecaptcha(captchaToken)
      if (!isCaptchaValid) {
        return res.status(400).json({
          success: false,
          message: 'Captcha verification failed',
          error: {
            type: 'validation',
            message: 'Please complete the captcha verification correctly',
          },
        })
      }
    }

    // Get current data
    const data = await readFaucetData()

    // Check if system is paused
    if (data.systemStatus.isPaused) {
      const now = Date.now()
      if (data.systemStatus.pauseUntil && now < data.systemStatus.pauseUntil) {
        const remainingTime = Math.floor((data.systemStatus.pauseUntil - now) / 1000)
        return res.status(503).json({
          success: false,
          message: 'Faucet is temporarily paused',
          remainingTime,
          error: {
            type: 'rate_limit',
            message: 'The faucet is temporarily paused due to high demand',
            details: `Please try again in ${Math.ceil(remainingTime / 60)} minutes`,
          },
        })
      }
      // Pause period has ended, unpause automatically
      data.systemStatus.isPaused = false
      data.systemStatus.pauseUntil = undefined
    }

    // Check rate limiting
    if (checkRateLimit(data.rateLimits, walletAddress)) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded',
        error: {
          type: 'rate_limit',
          message: 'Too many requests from this address',
          details: 'Please wait 10 minutes before trying again',
        },
      })
    }

    // Check cooldown period
    const cooldownCheck = isAddressInCooldown(data.claims, walletAddress)
    if (cooldownCheck.inCooldown) {
      return res.status(400).json({
        success: false,
        message: 'Address is in cooldown period',
        remainingTime: cooldownCheck.remainingTime,
        error: {
          type: 'rate_limit',
          message: 'You can only claim once every 24 hours',
          details: `Next claim available in ${Math.ceil(cooldownCheck.remainingTime / 3600)} hours`,
        },
      })
    }

    // Check if address is already in queue
    const normalizedAddress = walletAddress.toLowerCase()
    if (data.queue.includes(normalizedAddress)) {
      const queuePosition = data.queue.indexOf(normalizedAddress) + 1
      return res.status(400).json({
        success: false,
        message: 'Address is already in queue',
        queuePosition,
        error: {
          type: 'validation',
          message: 'Your address is already queued for processing',
          details: `Queue position: ${queuePosition}`,
        },
      })
    }

    // Check queue capacity
    if (data.queue.length >= data.systemStatus.queueCapacity) {
      // Auto-pause the system
      data.systemStatus.isPaused = true
      data.systemStatus.pauseUntil = Date.now() + FAUCET_CONFIG.PAUSE_DURATION
      await writeFaucetData(data)

      const remainingTime = Math.floor(FAUCET_CONFIG.PAUSE_DURATION / 1000)
      return res.status(503).json({
        success: false,
        message: 'Queue is full, faucet paused',
        remainingTime,
        error: {
          type: 'rate_limit',
          message: 'Queue capacity reached, faucet temporarily paused',
          details: `Please try again in ${Math.ceil(remainingTime / 60)} minutes`,
        },
      })
    }

    // Add to rate limit tracking
    addRateLimitEntry(data.rateLimits, walletAddress)

    // Add to queue
    data.queue.push(normalizedAddress)

    // Create claim record
    const claimRecord = {
      address: normalizedAddress,
      amount: FAUCET_CONFIG.AMOUNT,
      timestamp: Date.now(),
      status: 'pending' as const,
    }

    data.claims.push(claimRecord)

    // Save data
    await writeFaucetData(data)

    // Process the claim immediately (in a real implementation, you might want to use a queue processor)
    try {
      const txHash = await sendKASTokens(walletAddress, FAUCET_CONFIG.AMOUNT)

      // Update claim record with success
      const updatedData = await readFaucetData()
      const claimIndex = updatedData.claims.findIndex(
        (claim) => claim.address === normalizedAddress && claim.timestamp === claimRecord.timestamp,
      )

      if (claimIndex !== -1) {
        updatedData.claims[claimIndex].status = 'completed'
        updatedData.claims[claimIndex].txHash = txHash
      }

      // Remove from queue
      const queueIndex = updatedData.queue.indexOf(normalizedAddress)
      if (queueIndex !== -1) {
        updatedData.queue.splice(queueIndex, 1)
      }

      await writeFaucetData(updatedData)

      return res.status(200).json({
        success: true,
        message: 'Tokens sent successfully!',
        txHash,
      })
    } catch (error) {
      console.error('Error sending tokens:', error)

      // Update claim record with failure
      const updatedData = await readFaucetData()
      const claimIndex = updatedData.claims.findIndex(
        (claim) => claim.address === normalizedAddress && claim.timestamp === claimRecord.timestamp,
      )

      if (claimIndex !== -1) {
        updatedData.claims[claimIndex].status = 'failed'
      }

      // Remove from queue
      const queueIndex = updatedData.queue.indexOf(normalizedAddress)
      if (queueIndex !== -1) {
        updatedData.queue.splice(queueIndex, 1)
      }

      await writeFaucetData(updatedData)

      return res.status(500).json({
        success: false,
        message: 'Failed to send tokens',
        error: {
          type: 'network',
          message: 'Transaction failed',
          details: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      })
    }
  } catch (error) {
    console.error('Claim API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: {
        type: 'unknown',
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
}
