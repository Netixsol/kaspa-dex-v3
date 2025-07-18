import { NextApiRequest, NextApiResponse } from 'next'
import { readFaucetData, isValidEthereumAddress, isAddressInCooldown, ClaimRecord } from './utils'

interface StatusResponse {
  success: boolean
  data?: {
    hasClaimed: boolean
    nextClaimTime?: number
    lastClaimTime?: number
    remainingTime?: number
    lastTransaction?: string
    claimHistory: ClaimRecord[]
  }
  error?: {
    type: string
    message: string
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<StatusResponse>) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        type: 'validation',
        message: 'Only GET requests are allowed',
      },
    })
  }

  try {
    const { address } = req.query

    if (!address || typeof address !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          type: 'validation',
          message: 'Address parameter is required',
        },
      })
    }

    // Validate Ethereum address format
    if (!isValidEthereumAddress(address)) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'validation',
          message: 'Invalid Ethereum address format',
        },
      })
    }

    // Get current data
    const data = await readFaucetData()
    const normalizedAddress = address.toLowerCase()

    // Get claim history for this address
    const claimHistory = data.claims
      .filter((claim) => claim.address === normalizedAddress)
      .sort((a, b) => b.timestamp - a.timestamp)

    // Check cooldown status
    const cooldownCheck = isAddressInCooldown(data.claims, address)

    // Find last successful claim
    const lastSuccessfulClaim = claimHistory.find((claim) => claim.status === 'completed')

    // Calculate next claim time
    let nextClaimTime: number | undefined
    if (lastSuccessfulClaim && cooldownCheck.inCooldown) {
      nextClaimTime = lastSuccessfulClaim.timestamp + 24 * 60 * 60 * 1000 // 24 hours from last claim
    }

    return res.status(200).json({
      success: true,
      data: {
        hasClaimed: claimHistory.length > 0,
        nextClaimTime,
        lastClaimTime: lastSuccessfulClaim?.timestamp,
        remainingTime: cooldownCheck.remainingTime,
        lastTransaction: lastSuccessfulClaim?.txHash,
        claimHistory: claimHistory.slice(0, 10), // Return last 10 claims
      },
    })
  } catch (error) {
    console.error('Status API error:', error)
    return res.status(500).json({
      success: false,
      error: {
        type: 'unknown',
        message: 'Internal server error',
      },
    })
  }
}
