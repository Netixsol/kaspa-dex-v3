import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface SubscriptionProgressBarProps {
  currentDay: number
  totalDays: number
  size: number // Diameter of the circle
  thickness?: number
  colorStart?: string
  colorEnd?: string
  backgroundColor?: string
  textColor?: string
  textSize?: string
}

const ProgressBar: React.FC<SubscriptionProgressBarProps> = ({
  currentDay = 25,
  totalDays = 30,
  size = 252, // Default diameter
  thickness = 20,
  colorStart = '#00c6ff',
  colorEnd = '#0072ff',
  backgroundColor = '#e0e0e0',
  textColor = '#333',
  textSize = '1rem',
}) => {
  const radius = size / 2 // Calculate radius from diameter
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (Math.PI * currentDay) / totalDays

    // Arc generator
    const arcGenerator = d3
      .arc<d3.DefaultArcObject>()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(startAngle)
      .cornerRadius(10)

    // Complete arc objects
    const backgroundArc: d3.DefaultArcObject = {
      innerRadius: radius - thickness,
      outerRadius: radius,
      startAngle,
      endAngle: startAngle + Math.PI,
    }

    const getProgressArc = (angle: number): d3.DefaultArcObject => ({
      innerRadius: radius - thickness,
      outerRadius: radius,
      startAngle,
      endAngle: angle,
    })

    // Background arc
    svg
      .append('path')
      .attr('d', arcGenerator(backgroundArc) || '')
      .attr('fill', backgroundColor)
      .attr('transform', `translate(${radius}, ${radius + thickness / 2})`)

    // Progress arc
    const foreground = svg
      .append('path')
      .attr('fill', 'url(#gradient)')
      .attr('transform', `translate(${radius}, ${radius + thickness / 2})`)

    foreground
      .transition()
      .duration(1000)
      .attrTween('d', () => {
        const interpolate = d3.interpolate(startAngle, endAngle)
        return (t: number) => arcGenerator(getProgressArc(interpolate(t))) || ''
      })

    // Gradient
    const defs = svg.append('defs')
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')

    gradient.append('stop').attr('offset', '0%').attr('stop-color', colorStart)

    gradient.append('stop').attr('offset', '100%').attr('stop-color', colorEnd)
  }, [currentDay, totalDays, size, radius, thickness, colorStart, colorEnd, backgroundColor])

  return (
    <Container size={size} thickness={thickness}>
      <svg ref={svgRef} width={size} height={radius + thickness} viewBox={`0 0 ${size} ${radius + thickness}`} />

      <TextContainer thickness={thickness}>
        <ProgressText color={textColor} size={textSize}>
          {currentDay}/{totalDays}
        </ProgressText>
        <DaysText color={colorEnd} size="24px">
          Days
        </DaysText>
      </TextContainer>
    </Container>
  )
}

// (Styled components remain the same as previous example)
// Styled components with TypeScript props
interface ContainerProps {
  size: number
  thickness: number
}

const Container = styled.div<ContainerProps>`
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size / 2 + props.thickness}px;
  margin: 0 auto;
`

interface TextContainerProps {
  thickness: number
}

const TextContainer = styled.div<TextContainerProps>`
  position: absolute;
  bottom: ${(props) => props.thickness / 2}px;
  left: 0;
  right: 0;
  text-align: center;
`

interface TextProps {
  color: string
  size: string
}

const ProgressText = styled.div<TextProps>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: 400;
`

const DaysText = styled.div<TextProps>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
`

export default ProgressBar
