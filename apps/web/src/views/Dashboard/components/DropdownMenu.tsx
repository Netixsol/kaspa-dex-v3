import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Button, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import ArrowIcon from '../icons/arrowUp.ico'

export const EarningHistoryDropdownSkeleton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownHeader $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <Skeleton width={150} height={28} />
        <DropdownArrow $isOpen={isOpen}>
          <Skeleton width={31} height={31} variant="circle" />
        </DropdownArrow>
      </DropdownHeader>

      <DropdownContent $isOpen={isOpen}>
        {[...Array(3)].map((_, i) => (
          <DropdownItem key={`skeleton-item-${i}`}>
            <ItemMessage>
              <Skeleton width="80%" height={16} />
            </ItemMessage>
            <ItemPoints>
              <Skeleton width={60} height={16} marginBottom="4px" />
              <Skeleton width={80} height={12} />
            </ItemPoints>
          </DropdownItem>
        ))}
        <Skeleton width="100%" height={48} marginTop="20px" borderRadius="16px" />
      </DropdownContent>
    </DropdownContainer>
  )
}

const EarningHistoryDropdown: React.FC<{ earnings: any }> = ({ earnings }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        Earning History
        <DropdownArrow $isOpen={isOpen}>
          <ArrowIcon width="13" height="9" viewBox="0 0 13 9" fill="none" color={isOpen ? '#120F1F' : '#ffffff'} />
        </DropdownArrow>
      </DropdownHeader>

      <DropdownContent $isOpen={isOpen}>
        {earnings?.length <= 0 && (
          <Flex width="100%" justifyContent="center" marginTop="20px">
            <Text>No Data Available</Text>
          </Flex>
        )}
        {earnings?.map((item) => (
          <DropdownItem key={item.id}>
            <ItemMessage>{item.reward_event}</ItemMessage>
            <ItemPoints>
              <Points>+{item.points_awarded} Point</Points>
              <PointsDate>{item.reward_date}</PointsDate>
            </ItemPoints>
          </DropdownItem>
        ))}
        <Link href="/dashboard/earning-history" passHref>
          <Button variant="secondary" width="100%" marginTop="20px">
            See All
          </Button>
        </Link>
      </DropdownContent>
    </DropdownContainer>
  )
}

// Styled components
const DropdownContainer = styled.div`
  position: relative;
  /* width: 100%; */
  min-width: 390px;
  z-index: 1000;
  background: #252136;
  border-radius: 10px;
  flex-grow: 1;

  @media(max-width: 450px){
    min-width: 280px;
  }
`

const DropdownHeader = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 12px;
  padding-inline: 20px;
  cursor: pointer;
  font-size: 24px;
  font-weight: 500;
  color: ${({ $isOpen }) => ($isOpen ? '#1fd26f' : '#ffffff')};
  background: #252136;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: ${({ $isOpen }) => ($isOpen ? '0px' : '10px')};
  border-bottom-left-radius: ${({ $isOpen }) => ($isOpen ? '0px' : '10px')};
  position: relative;

  @media(max-width: 400px){
    font-size: 21px;
  }
`

const DropdownArrow = styled.span<{ $isOpen: boolean }>`
  font-size: 14px;
  width: 31px;
  height: 31px;
  background: ${({ $isOpen }) => ($isOpen ? '#1fd26f' : '#120F1F')};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0)' : 'rotate(180deg)')};
  transition: transform 0.2s ease;
`

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #252136;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform-origin: top;
  transform: ${({ $isOpen }) => ($isOpen ? 'scaleY(1)' : 'scaleY(0)')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: all 0.3s ease;
  z-index: 999;
  max-height: 700px;
  overflow-y: auto;
  padding-inline: 20px;
  padding-top: 13px;
  padding-bottom: 26px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`

const DropdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 13px 10px 16px;
  margin-top: 10px;
  background: #120f1f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 5px;

  &:last-child {
    border-bottom: none;
  }
`

const ItemMessage = styled.div`
  font-size: 14px;
  color: #ffffff;
  flex: 1;
`

const ItemPoints = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const Points = styled.div`
  font-size: 14px;
  color: #1fd26f;
  font-weight: 500;
`

const PointsDate = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
`

export default EarningHistoryDropdown
