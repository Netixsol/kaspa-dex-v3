import { ArrowDropDownIcon, ArrowDropUpIcon, FlexGap } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react' // Import useEffect and useRef
import styled from 'styled-components'

// Define your dropdown component
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownButton = styled.button`
  background-color: transparent;
  border-radius: 6px;
  color: #fff;
  border: none;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`

const DropdownList = styled.ul`
  position: absolute;
  border-radius: 6px;
  z-index: 10;
  top: 100%;
  left: 0;
  margin: 0;
  padding: 1px;
  list-style: none;
  background-color: #252136;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: ${(props: { isOpen: boolean }) => (props.isOpen ? 'block' : 'none')};
`

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    opacity: 0.7;
  }
`

interface Option {
  label: string
  value: string
}

interface DropdownProps {
  options: Option[]
}

function SwapDropdown({ options }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<Option | null>({
    label: 'Swap',
    value: 'swap',
  })

  const dropdownRef = useRef(null) // Create a ref for the dropdown container

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  // Add a click event listener to close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={toggleDropdown}>
        <FlexGap gap="2px" alignItems="center">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            color="#fff"
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'rgb(255, 255, 255)', transform: 'rotate(90deg)' }}
          >
            <path d="M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z" />
          </svg>
          {selectedOption.label}
          <ArrowDropDownIcon />
        </FlexGap>
      </DropdownButton>
      <DropdownList isOpen={isOpen}>
        {options.map((option) => (
           <Link href={option.value}>
          <DropdownItem key={option.value}>
            {/* <DropdownItem key={option.value} onClick={() => handleOptionClick(option)}> */}
           {option.label}
          </DropdownItem>
          </Link>
        ))}
      </DropdownList>
    </DropdownContainer>
  )
}

export default SwapDropdown
