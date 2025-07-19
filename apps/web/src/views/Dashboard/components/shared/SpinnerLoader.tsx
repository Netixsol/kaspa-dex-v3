import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Loader = styled.div<{
  size: number
  color: string
  bg: string
  borderWidth: number
}>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border: ${({ borderWidth, bg }) => `${borderWidth}px solid ${bg}`};
  border-bottom-color: ${({ color }) => color};
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${rotate} 1s linear infinite;
`

type Props = {
  size?: number
  color?: string
  bg?: string
  borderWidth?: number
}

export default function SpinnerLoader({
  size = 48,
  color = '#FF3D00',
  bg = '#fff',
  borderWidth,
}: Props) {
  const border = borderWidth ?? Math.max(2, Math.floor(size * 0.1))
  return <Loader size={size} color={color} bg={bg} borderWidth={border} />
}
