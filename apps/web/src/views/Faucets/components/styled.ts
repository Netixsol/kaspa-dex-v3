import styled from 'styled-components'
import { Card, Button, Text, Input } from '@pancakeswap/uikit'

// Styled Components
export const FaucetContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
  max-width: 100%;
  width: 100%;

  @media (max-width: 1200px) {
    gap: 32px;
  }

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`

export const FaucetIcon = styled.img`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 24px;
  object-fit: cover;
`

export const MainCard = styled(Card)`
  background: #2efe87;
  border: 1px solid rgba(46, 254, 135, 0.2);
  border-radius: 20px;
  margin-bottom: 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(46, 254, 135, 0.4);
    box-shadow: 0 8px 16px rgba(46, 254, 135, 0.1);
  }
`

export const WarningCard = styled(Card)<{ variant?: 'warning' | 'error' | 'success' }>`
  background: ${({ variant }) => {
    switch (variant) {
      case 'warning':
        return 'rgba(255, 193, 7, 0.1)'
      case 'error':
        return 'rgba(255, 107, 107, 0.1)'
      case 'success':
        return 'rgba(46, 254, 135, 0.1)'
      default:
        return '#2efe87'
    }
  }};
  border: 1px solid
    ${({ variant }) => {
      switch (variant) {
        case 'warning':
          return 'rgba(255, 193, 7, 0.3)'
        case 'error':
          return 'rgba(255, 107, 107, 0.3)'
        case 'success':
          return 'rgba(46, 254, 135, 0.3)'
        default:
          return 'rgba(46, 254, 135, 0.2)'
      }
    }};
  border-radius: 16px;
  margin-bottom: 16px;
`

export const QueueStatusCard = styled(Card)`
  background: linear-gradient(135deg, #2efe87 0%, #1e7c47 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  color: #ffffff;
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const StyledInput = styled(Input)`
  background: #252136;
  border: 1px solid rgba(46, 254, 135, 0.2);
  border-radius: 12px;
  color: #ffffff;
  font-family: 'Courier New', monospace;

  &:focus {
    border-color: #2efe87;
    box-shadow: 0 0 0 2px rgba(46, 254, 135, 0.2);
  }

  &::placeholder {
    color: #ffffff;
  }
`

export const ClaimButton = styled(Button)`
  background: linear-gradient(135deg, #2efe87 0%, #1e7c47 100%);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-weight: bold;
  height: 48px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(46, 254, 135, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const InfoListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

export const InfoIcon = styled.span<{ variant?: 'success' | 'info' | 'warning' }>`
  color: ${({ variant }) => {
    switch (variant) {
      case 'success':
        return '#2efe87'
      case 'warning':
        return '#ffc107'
      default:
        return '#17a2b8'
    }
  }};
  font-size: 16px;
  margin-top: 2px;
`

export const TechnicalCard = styled(Card)`
  background: #2efe87;
  border: 1px solid rgba(46, 254, 135, 0.2);
  border-radius: 16px;
  text-align: center;
`

export const CountdownText = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: #ffc107;
`

export const ProgressContainer = styled.div`
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  height: 8px;
  overflow: hidden;
`

export const ProgressBar = styled.div<{ width: number }>`
  background: #ffffff;
  height: 100%;
  width: ${({ width }) => width}%;
  border-radius: 12px;
  transition: width 0.3s ease;
`

export const ErrorCard = styled(Card)<{ severity?: 'error' | 'warning' | 'info' }>`
  background: ${({ severity }) => {
    switch (severity) {
      case 'error':
        return 'rgba(255, 107, 107, 0.15)'
      case 'warning':
        return 'rgba(255, 193, 7, 0.15)'
      case 'info':
        return 'rgba(46, 254, 135, 0.15)'
      default:
        return 'rgba(255, 107, 107, 0.15)'
    }
  }};
  border: 1px solid
    ${({ severity }) => {
      switch (severity) {
        case 'error':
          return 'rgba(255, 107, 107, 0.4)'
        case 'warning':
          return 'rgba(255, 193, 7, 0.4)'
        case 'info':
          return 'rgba(46, 254, 135, 0.4)'
        default:
          return 'rgba(255, 107, 107, 0.4)'
      }
    }};
  border-radius: 16px;
  margin-bottom: 16px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const TimerCard = styled(Card)`
   background:rgb(206, 64, 46);
  border: 1px solid rgba(46, 254, 135, 0.2);
  border-radius: 16px;
  margin-bottom: 24px;
  text-align: center;
`

export const TimerDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 16px 0;

  @media (max-width: 480px) {
    gap: 8px;
    flex-wrap: wrap;
  }
`

export const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 8px;
  min-width: 60px;

  @media (max-width: 480px) {
    min-width: 50px;
    padding: 8px 6px;
  }
`

export const TimeValue = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`

export const TimeLabel = styled.span`
  font-size: 12px;
  color: #cbd5e0;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const StatusBadge = styled.div<{ status: 'available' | 'cooldown' | 'error' | 'processing' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;

  ${({ status }) => {
    switch (status) {
      case 'available':
        return `
          background: rgba(46, 254, 135, 0.2);
          color: #2efe87;
          border: 1px solid rgba(46, 254, 135, 0.3);
        `
      case 'cooldown':
        return `
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.3);
        `
      case 'error':
        return `
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.3);
        `
      case 'processing':
        return `
          background: rgba(46, 254, 135, 0.2);
          color: #2efe87;
          border: 1px solid rgba(46, 254, 135, 0.3);
          animation: pulse 2s infinite;
        `
      default:
        return `
          background: rgba(46, 254, 135, 0.2);
          color: #2efe87;
          border: 1px solid rgba(46, 254, 135, 0.3);
        `
    }
  }}

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`

export const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`