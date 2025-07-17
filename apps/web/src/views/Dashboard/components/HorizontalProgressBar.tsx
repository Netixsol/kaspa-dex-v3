import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

interface HorizontalProgressBarProps {
  progress: number // 0-100
  height?: number
  borderRadius?: number
  backgroundColor?: string
  progressColor?: string
}

const HorizontalProgressBar: React.FC<HorizontalProgressBarProps> = ({
  progress = 0,
  height = 6,
  backgroundColor = '#120F1F',
  progressColor = '#1FD26F',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Initialize and update progress
  useEffect(() => {
    if (!containerRef.current || containerWidth === 0) return

    const svg = d3.select(containerRef.current).select('svg')
    const progressWidth = (progress / 100) * containerWidth

    // Remove existing progress rect if any
    svg.select('.progress-rect').remove()

    // Create background
    svg.select('.background-rect').remove()
    svg
      .append('rect')
      .attr('class', 'background-rect')
      .attr('width', '100%')
      .attr('height', height)
      .attr('rx', height / 2)
      .attr('fill', backgroundColor)

    // Create progress
    svg
      .append('rect')
      .attr('class', 'progress-rect')
      .attr('height', height)
      .attr('rx', height / 2)
      .attr('fill', progressColor)
      .attr('width', 0) // Start from 0
      .transition()
      .duration(500)
      .attr('width', progressWidth)
  }, [progress, containerWidth, height, backgroundColor, progressColor])

  return (
    <ProgressContainer ref={containerRef} height={height} borderRadius={height / 2}>
      <svg width="100%" height={height} style={{ position: 'absolute' }} />
    </ProgressContainer>
  )
}

const ProgressContainer = styled.div<{
  height: number
  borderRadius: number
}>`
  width: 100%;
  height: ${(props) => props.height}px;
  border-radius: ${(props) => props.borderRadius}px;
  position: relative;
  /* overflow: hidden; */
`

export default HorizontalProgressBar
