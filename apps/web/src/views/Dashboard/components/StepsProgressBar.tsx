import React from 'react'
import styled from 'styled-components'
import TickIcon from '../icons/tick.ico'

interface StepProgressProps {
  steps: {
    id: string
    label: string
    completed: boolean
    icon?: React.ReactNode
  }[]
  activeStep?: string
}

const VerticalStepProgress: React.FC<StepProgressProps> = ({ steps, activeStep }) => {
  return (
    <ProgressContainer>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <StepContainer>
            <StepCircle completed={step.completed} isActive={activeStep === step.id}>
              {step.completed ? (
                <TickIcon width={14} height={10} fill="none" padding="auto" />
              ) : (
                step.icon || <span>{index + 1}</span>
              )}
            </StepCircle>
            <StepLabel completed={step.completed}>{step.label}</StepLabel>
          </StepContainer>

          {index < steps.length - 1 && <StepConnector completed={steps[index].completed} />}
        </React.Fragment>
      ))}
    </ProgressContainer>
  )
}

// Styled components
const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  /* margin-bottom: 8px; */
  position: relative;
`

const StepCircle = styled.div<{ completed: boolean; isActive?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: ${({ completed, isActive }) => (completed ? '#1FD26F' : isActive ? '#2196F3' : '#E0E0E0')}; */
  background-color: #1fd26f;
  color: #1fd26f;
  font-weight: bold;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const StepLabel = styled.span<{ completed: boolean }>`
  margin-left: 22px;
  /* color: ${({ completed }) => (completed ? '#1FD26F' : '#757575')}; */
  color: #ffffff;
  font-weight: ${({ completed }) => (completed ? '500' : '400')};
`

const StepConnector = styled.div<{ completed: boolean }>`
  height: 20px;
  width: 1px;
  background-color: #1fd26f;
  /* background-color: ${({ completed }) => (completed ? '#1FD26F' : '#E0E0E0')}; */
  margin-left: 14px;
`

export default VerticalStepProgress
