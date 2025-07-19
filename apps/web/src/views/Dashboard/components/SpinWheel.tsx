import styled from 'styled-components'
import { SpinWheelProps } from './spin-wheel-types'

const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 20px auto;
  border-radius: 50%;
  box-sizing: border-box;
`

const SpinWheelWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  /* left: 20px; */
  overflow: hidden;
  background-color: #252136;
  border-radius: 50%;
  box-sizing: border-box;
`

const SpinButton = styled.button`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  color: #1fd26f;
  background-color: #120f1f;
  font-size: 14px;
  letter-spacing: 0.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  z-index: 1;
  border: none;

  &:focus {
    outline: none;
  }

  &:disabled {
    background-color: #252136;
  }
`
export const SpinWheel = ({
  borderColor = '#1FD26F',
  spinActionName = 'spin',
  size = 380,
  selectedItem,
  initState,
  randIndex,
  items,
  spinTime,
  spinContainerStyle,
  spinWheelStyle,
  spinButtonStyle,
  spinFontStyle,
}: SpinWheelProps) => {

  const rotationOffset = 270 - 360 / items.length / 2

  return (
    <>
      <SpinContainer style={{ width: size, height: size, ...spinContainerStyle }}>
        {/* Arrow Pointer */}
        <svg
          width="36"
          height="35"
          style={{
            position: 'absolute',
            top: -13,
            left: '49%',
            transform: 'translateX(-50%)',
            zIndex: 3,
          }}
          viewBox="0 0 36 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34.9204 8.12L23.0204 31.91C20.9504 36.04 15.0504 36.04 12.9904 31.91L1.09043 8.12C-0.779575 4.39 1.94043 0 6.11043 0H29.9104C34.0804 0 36.7904 4.39 34.9304 8.12H34.9204Z"
            fill="#120F1F"
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px',
            border: `5px solid ${borderColor}`,
            backgroundColor: '#252136',
            borderRadius: '50%',
            zIndex: 2,
          }}
        >
            <SpinButton
              type='button'
              style={spinButtonStyle}>
              {spinActionName}
            </SpinButton>
        </div>

        <SpinWheelWrapper>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: initState
                ? `rotate(${rotationOffset}deg)`
                : `rotate(-${720 + randIndex * (360 / items.length) - rotationOffset}deg)`,
              transition: !initState ? `transform ${Math.floor(spinTime / 1000)}s ease` : 'none',
              ...spinWheelStyle,
            }}
          >
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} stroke="#1FD26F" strokeWidth={6} fill="transparent" />

            {items.map((item, itemindex) => {
              const angle = (360 / items.length) * itemindex
              const x = size / 2 + (size / 2 - 2) * Math.cos((Math.PI * angle) / 180)
              const y = size / 2 + (size / 2 - 2) * Math.sin((Math.PI * angle) / 180)
              const labelAngle = angle + 360 / items.length / 2
              const labelX = size / 2 + (size / 2 - 60) * Math.cos((Math.PI * labelAngle) / 180)
              const labelY = size / 2 + (size / 2 - 60) * Math.sin((Math.PI * labelAngle) / 180)

              return (
                <g>
                  <line x1={size / 2} y1={size / 2} x2={x} y2={y} stroke="#1FD26F" strokeWidth={5} />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="19"
                    fill="#fff"
                    transform={`rotate(${labelAngle}, ${labelX}, ${labelY})`}
                    style={{
                      fontWeight: 'bold',
                      pointerEvents: 'none',
                      position: 'absolute',
                      ...spinFontStyle,
                    }}
                  >
                    {typeof item === 'string' ? item : item}
                  </text>
                </g>
              )
            })}
          </svg>
        </SpinWheelWrapper>
      </SpinContainer>
    </>
  )
}
