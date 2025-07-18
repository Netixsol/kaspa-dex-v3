import { NextApiRequest, NextApiResponse } from 'next'
import { readFaucetData } from './utils'

interface QueueStatusResponse {
  success: boolean
  data?: {
    queueSize: number
    queueCapacity: number
    isPaused: boolean
    pauseUntil?: number
    remainingPauseTime?: number
    estimatedWaitTime?: number
  }
  error?: {
    type: string
    message: string
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<QueueStatusResponse>) {
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
    // Get current data
    const data = await readFaucetData()
    const now = Date.now()

    // Check if pause period has ended
    let { isPaused } = data.systemStatus
    let remainingPauseTime: number | undefined

    if (isPaused && data.systemStatus.pauseUntil) {
      if (now >= data.systemStatus.pauseUntil) {
        // Pause period has ended
        isPaused = false
        remainingPauseTime = 0
      } else {
        remainingPauseTime = Math.floor((data.systemStatus.pauseUntil - now) / 1000)
      }
    }

    // Estimate wait time (rough calculation)
    // Assuming 1 transaction per minute processing time
    const estimatedWaitTime = data.queue.length * 60 // seconds

    return res.status(200).json({
      success: true,
      data: {
        queueSize: data.queue.length,
        queueCapacity: data.systemStatus.queueCapacity,
        isPaused,
        pauseUntil: data.systemStatus.pauseUntil,
        remainingPauseTime,
        estimatedWaitTime,
      },
    })
  } catch (error) {
    console.error('Queue status API error:', error)
    return res.status(500).json({
      success: false,
      error: {
        type: 'unknown',
        message: 'Internal server error',
      },
    })
  }
}
