import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

interface TimerProps {
  targetDate?: Date // Optional target date for countdown
  initialTime?: number // Optional initial time in seconds
  onComplete?: () => void // Callback when timer reaches zero
}

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
`

const TimeDisplay = styled.div`
  display: flex;
  gap: 10px;
`

const TimeSegment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TimeValue = styled.span`
  color: #1fcd6d; // Green color for the numbers
  font-size: 2rem;
  font-weight: bold;
`

const TimeLabel = styled.span`
  color: #ffffff;
  font-size: 0.8rem;
  text-transform: uppercase;
`

const Colon = styled.span`
  color: #1fcd6d;
  font-size: 2rem;
  font-weight: bold;
  align-self: start;
`

const DigitalTimer: React.FC<TimerProps> = ({ targetDate, initialTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const timerRef = useRef<NodeJS.Timeout>()

  // Calculate initial time left
  useEffect(() => {
    if (targetDate) {
      const now = new Date().getTime()
      const difference = Math.floor((targetDate.getTime() - now) / 1000)
      setTimeLeft(Math.max(0, difference))
    } else if (initialTime !== undefined) {
      setTimeLeft(Math.max(0, initialTime))
    }

    // Start timer immediately after setting initial time
    const updateTimer = () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Check for <= 1 instead of <= 0 to prevent extra interval
          if (timerRef.current) clearInterval(timerRef.current)
          if (onComplete) onComplete()
          return 0
        }
        return prev - 1
      })
    }

    // Clear any existing interval
    if (timerRef.current) clearInterval(timerRef.current)

    // Start timer if initial time is > 0
    const initialTimeValue = targetDate ? Math.floor((targetDate.getTime() - new Date().getTime()) / 1000) : initialTime
    if ((initialTimeValue !== undefined && initialTimeValue > 0) || (targetDate && initialTimeValue > 0)) {
      timerRef.current = setInterval(updateTimer, 1000)
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [targetDate, initialTime, onComplete]) // Removed timeLeft from dependencies

  // Calculate days, hours, minutes
  const days = Math.floor(timeLeft / (3600 * 24))
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  // Format numbers to always show 2 digits
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  return (
    <TimerContainer>
      <TimeDisplay>
        <TimeSegment>
          <TimeValue>{formatNumber(Math.floor(days))}</TimeValue>
          <TimeLabel>days</TimeLabel>
        </TimeSegment>
        <Colon>:</Colon>
        <TimeSegment>
          <TimeValue>{formatNumber(hours)}</TimeValue>
          <TimeLabel>hours</TimeLabel>
        </TimeSegment>
        <Colon>:</Colon>
        <TimeSegment>
          <TimeValue>{formatNumber(Math.floor(minutes))}</TimeValue>
          <TimeLabel>mins</TimeLabel>
        </TimeSegment>
        <Colon>:</Colon>
        <TimeSegment>
          <TimeValue>{formatNumber(seconds)}</TimeValue>
          <TimeLabel>SEC</TimeLabel>
        </TimeSegment>
      </TimeDisplay>
    </TimerContainer>
  )
}

export default DigitalTimer
