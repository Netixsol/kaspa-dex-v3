import { Box } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const DashBox = styled(Box)`
  background: #252136;
  border-radius: 25px;
  /* overflow: auto; */
  padding: 30px;
  min-width: 390px;
  width: 31%;
  flex: 1;
  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: #120f1f;
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    height: 70px;
    width: 5px;
    background-color: #1fd26f;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }

  @media (max-width: 450px) {
    min-width: 280px;
  }
    
  @media (max-width: 375px) {
    padding: 30px 13px;
  }
`
// Styled Components (using transient props with $ prefix)
export const AvatarContainer = styled.div<{ $size: number }>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  margin: 0 auto;
`

export const AvatarImage = styled.img<{ $size: number }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: ${({ $size }) => Math.max(3, $size * 0.04)}px solid ${({ theme }) => theme.colors.primary};
`

export const CrownBadge = styled.div<{
  $position: number
  $avatarSize: number
  $crownSize: number
}>`
  position: absolute;
  top: ${({ $crownSize }) => -0.99 * $crownSize}px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: ${({ $crownSize }) => $crownSize}px;
  height: ${({ $crownSize }) => $crownSize}px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`

export const PositionLabel = styled.div<{
  $position: number
  $avatarSize: number
  $labelScale: number
  $labelHeight: number
}>`
  position: absolute;
  bottom: ${({ $avatarSize }) => -$avatarSize * 0.12}px;
  left: 50%;
  transform: translateX(-50%);
  background: #1fd26f;
  color: black;
  border-radius: 100%;
  /* padding: 0 ${({ $labelHeight }) => $labelHeight * 0.5}px; */
  font-size: 12px;
  max-width: 17px;
  width: 100%;
  height: 17px;
  line-height: 1.5px;
  text-align: center;
  z-index: 1;
  place-content: center;
`
