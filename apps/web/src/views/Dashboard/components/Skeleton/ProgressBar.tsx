import React from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'
import { Skeleton } from '@pancakeswap/uikit'

interface ProgressBarSkeletonProps {
  size?: number
  thickness?: number
  textSize?: string
  backgroundColor?: string
}

const ProgressBarSkeleton: React.FC<ProgressBarSkeletonProps> = ({
  size = 352,
  thickness = 20,
  textSize = '1rem',
  backgroundColor = '#e0e0e0',
}) => {
  const radius = size / 2
  const svgRef = React.useRef<SVGSVGElement>(null)

  React.useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const startAngle = -Math.PI / 2
    const endAngle = startAngle + Math.PI // Full semicircle for skeleton

    // Arc generator (same as original component)
    const arcGenerator = d3
      .arc<d3.DefaultArcObject>()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(startAngle)
      .cornerRadius(10)

    // Background arc (full semicircle)
    svg
      .append('path')
      .attr(
        'd',
        arcGenerator({
          innerRadius: radius - thickness,
          outerRadius: radius,
          startAngle,
          endAngle,
        }) || '',
      )
      .attr('fill', backgroundColor)
      .attr('transform', `translate(${radius}, ${radius + thickness / 2})`)
      .style('opacity', 0.3) // Make it subtle for skeleton
  }, [size, radius, thickness, backgroundColor])

  return (
    <Container size={size} thickness={thickness}>
      <svg ref={svgRef} width={size} height={radius + thickness} viewBox={`0 0 ${size} ${radius + thickness}`} />

      <TextContainer thickness={thickness}>
        <Skeleton width={80} height={textSize === '3rem' ? 36 : 24} margin="0 auto" />
        <Skeleton width={60} height={20} margin="8px auto 0" />
      </TextContainer>
    </Container>
  )
}

// Reuse your existing styled components
const Container = styled.div<{ size: number; thickness: number }>`
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size / 2 + props.thickness}px;
  margin: 0 auto;
`

const TextContainer = styled.div<{ thickness: number }>`
  position: absolute;
  bottom: ${(props) => props.thickness / 2}px;
  left: 0;
  right: 0;
  text-align: center;
`

export { ProgressBarSkeleton }
