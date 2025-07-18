import { NextApiRequest, NextApiResponse } from 'next'
import { readFaucetData, writeFaucetData, cleanupOldData, getFaucetBalance } from './utils'

interface AdminRequest {
  action: 'pause' | 'unpause' | 'cleanup' | 'status' | 'reset_queue'
  adminKey: string
  duration?: number // For pause action (in minutes)
}

interface AdminResponse {
  success: boolean
  message: string
  data?: any
  error?: {
    type: string
    message: string
  }
}

const ADMIN_KEY = process.env.FAUCET_ADMIN_KEY || 'admin123' // Change this in production!

export default async function handler(req: NextApiRequest, res: NextApiResponse<AdminResponse>) {
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
    const { action, adminKey, duration }: AdminRequest = req.body

    // Validate admin key
    if (adminKey !== ADMIN_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: {
          type: 'validation',
          message: 'Invalid admin key',
        },
      })
    }

    // Get current data
    const data = await readFaucetData()

    switch (action) {
      case 'pause':
        data.systemStatus.isPaused = true
        if (duration) {
          data.systemStatus.pauseUntil = Date.now() + duration * 60 * 1000
        }
        await writeFaucetData(data)
        return res.status(200).json({
          success: true,
          message: `Faucet paused${duration ? ` for ${duration} minutes` : ' indefinitely'}`,
        })

      case 'unpause':
        data.systemStatus.isPaused = false
        data.systemStatus.pauseUntil = undefined
        await writeFaucetData(data)
        return res.status(200).json({
          success: true,
          message: 'Faucet unpaused',
        })

      case 'cleanup':
        await cleanupOldData()
        return res.status(200).json({
          success: true,
          message: 'Old data cleaned up successfully',
        })

      case 'reset_queue':
        data.queue = []
        await writeFaucetData(data)
        return res.status(200).json({
          success: true,
          message: 'Queue reset successfully',
        })

      case 'status': {
        const balance = await getFaucetBalance()
        return res.status(200).json({
          success: true,
          message: 'Faucet status retrieved',
          data: {
            isPaused: data.systemStatus.isPaused,
            pauseUntil: data.systemStatus.pauseUntil,
            queueSize: data.queue.length,
            queueCapacity: data.systemStatus.queueCapacity,
            totalClaims: data.claims.length,
            pendingClaims: data.claims.filter((claim) => claim.status === 'pending').length,
            completedClaims: data.claims.filter((claim) => claim.status === 'completed').length,
            failedClaims: data.claims.filter((claim) => claim.status === 'failed').length,
            faucetBalance: balance,
            rateLimitEntries: Object.keys(data.rateLimits).length,
          },
        })
      }

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action',
          error: {
            type: 'validation',
            message: 'Action must be one of: pause, unpause, cleanup, status, reset_queue',
          },
        })
    }
  } catch (error) {
    console.error('Admin API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
}
