import { RowBetween } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const Wrapper = styled.div`
  border-radius: 4px;
  width: 100%;
`

export const TabContainer = styled.div`
  display: flex;
  /* flex: 1; */
  border-radius: 999px;
  /* width: 100%; */
  display: flex;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 3px 6px;
`

export const TabText = styled.div<{ isActive: boolean }>`
  display: flex;

  align-items: center;
  gap: 2px;
  /* color: ${({ theme, isActive }) => (isActive ? theme.colors.text : theme.colors.textSubtle)}; */
  color: ${({ theme, isActive }) => (isActive ? '#120F1F' : 'white')};
  font-size: 16px;
  font-weight: 600;
  margin-left: 4px;
`
export const InfoRow = styled(RowBetween)`
  padding: 14px 0;

  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const InfoRowLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};

  font-size: 14px;
`

export const InfoRowValue = styled.div`
  color: ${({ theme }) => theme.colors.text};

  font-size: 12px;
  font-weight: 500;
`
