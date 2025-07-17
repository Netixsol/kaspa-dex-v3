import { useState, useEffect, useCallback } from 'react'

// Types
interface ClaimError {
  type: 'validation' | 'network' | 'contract' | 'rate_limit' | 'insufficient_funds' | 'unknown'
  message: string
  details?: string
}

interface ClaimStatus {
  hasClaimed: boolean
  nextClaimTime?: number
  lastClaimTime?: number
  remainingTime?: number
  lastTransaction?: string
}

interface QueueStatus {
  queueSize: number
  queueCapacity: number
  isPaused: boolean
  pauseUntil?: number
  remainingPauseTime?: number
  estimatedWaitTime?: number
}

interface UseFaucetReturn {
  // State
  isLoading: boolean
  error: ClaimError | null
  claimStatus: ClaimStatus | null
  queueStatus: QueueStatus | null

  // Actions
  claimTokens: (address: string, captchaToken?: string) => Promise<void>
  fetchStatus: (address: string) => Promise<void>
  fetchQueueStatus: () => Promise<void>
  clearError: () => void

  // Computed values
  canClaim: boolean
  cooldownRemaining: number
  isPaused: boolean
  queueSize: number
  queueCapacity: number
}

export const useFaucet = (): UseFaucetReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ClaimError | null>(null)
  const [claimStatus, setClaimStatus] = useState<ClaimStatus | null>(null)
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null)

  // Fetch queue status
  const fetchQueueStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/kas-faucet/queue')
      const result = await response.json()

      if (result.success) {
        setQueueStatus(result.data)
      } else {
        console.error('Failed to fetch queue status:', result.error)
      }
    } catch (err) {
      console.error('Error fetching queue status:', err)
    }
  }, [])

  // Fetch claim status for a specific address
  const fetchStatus = useCallback(async (address: string) => {
    if (!address) return

    try {
      const response = await fetch(`/api/kas-faucet/status?address=${encodeURIComponent(address)}`)
      const result = await response.json()

      if (result.success) {
        setClaimStatus(result.data)
      } else {
        console.error('Failed to fetch claim status:', result.error)
      }
    } catch (err) {
      console.error('Error fetching claim status:', err)
    }
  }, [])

  // Claim tokens
  const claimTokens = useCallback(
    async (address: string, captchaToken?: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/kas-faucet/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
            captchaToken,
          }),
        })

        const result = await response.json()

        if (result.success) {
          // Refresh status after successful claim
          await fetchStatus(address)
          await fetchQueueStatus()
        } else {
          setError(
            result.error || {
              type: 'unknown',
              message: result.message || 'Unknown error occurred',
            },
          )
        }
      } catch (err) {
        setError({
          type: 'network',
          message: 'Failed to submit claim request',
          details: err instanceof Error ? err.message : 'Network error',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [fetchStatus, fetchQueueStatus],
  )

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Auto-fetch queue status periodically
  useEffect(() => {
    fetchQueueStatus()
    const interval = setInterval(fetchQueueStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [fetchQueueStatus])

  // Auto-update countdown timers
  useEffect(() => {
    if (!claimStatus?.remainingTime && !queueStatus?.remainingPauseTime) return undefined

    const interval = setInterval(() => {
      if (claimStatus?.remainingTime && claimStatus.remainingTime > 0) {
        setClaimStatus((prev) =>
          prev
            ? {
                ...prev,
                remainingTime: Math.max(0, (prev.remainingTime || 0) - 1),
              }
            : null,
        )
      }

      if (queueStatus?.remainingPauseTime && queueStatus.remainingPauseTime > 0) {
        setQueueStatus((prev) =>
          prev
            ? {
                ...prev,
                remainingPauseTime: Math.max(0, (prev.remainingPauseTime || 0) - 1),
              }
            : null,
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [claimStatus?.remainingTime, queueStatus?.remainingPauseTime])

  // Computed values
  const canClaim =
    !isLoading && !queueStatus?.isPaused && !error && (!claimStatus?.remainingTime || claimStatus.remainingTime === 0)

  const cooldownRemaining = claimStatus?.remainingTime || 0
  const isPaused = queueStatus?.isPaused || false
  const queueSize = queueStatus?.queueSize || 0
  const queueCapacity = queueStatus?.queueCapacity || 30

  return {
    // State
    isLoading,
    error,
    claimStatus,
    queueStatus,

    // Actions
    claimTokens,
    fetchStatus,
    fetchQueueStatus,
    clearError,

    // Computed values
    canClaim,
    cooldownRemaining,
    isPaused,
    queueSize,
    queueCapacity,
  }
}