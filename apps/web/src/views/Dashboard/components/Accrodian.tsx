import React, { useState, createContext, useContext } from 'react'
import styled from 'styled-components'
import ChevronIcon from '../icons/arrowUp.ico'

interface AccordionContextProps {
  activeId: string | null
  toggleItem: (id: string) => void
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined)

const useAccordion = () => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be wrapped in <Accordion>')
  }
  return context
}

// Parent Component
const Accordion: React.FC<{ children: React.ReactNode }> & {
  Item: typeof AccordionItem
  Header: typeof AccordionHeader
  Content: typeof AccordionContent
} = ({ children }) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <AccordionContext.Provider value={{ activeId, toggleItem }}>
      <AccordionContainer>{children}</AccordionContainer>
    </AccordionContext.Provider>
  )
}

// Item Component
const AccordionItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { activeId } = useAccordion()
  const isActive = activeId === id

  return (
    <AccordionItemWrapper $isActive={isActive}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { id, isActive } as any)
        }
        return child
      })}
    </AccordionItemWrapper>
  )
}

// Header Component
const AccordionHeader: React.FC<{
  id: string
  isActive?: boolean
  children: React.ReactNode
}> = ({ id, isActive, children }) => {
  const { toggleItem } = useAccordion()

  return (
    <StyledHeader onClick={() => toggleItem(id)} $isActive={isActive}>
      <HeaderContent>{children}</HeaderContent>
      <AccordionArrow $isActive={isActive}>
        <ChevronIcon width="10" height="9" viewBox="0 0 13 9" fill="none" color={isActive ? '#120F1F' : '#ffffff'} />
      </AccordionArrow>
    </StyledHeader>
  )
}

// Content Component
const AccordionContent: React.FC<{
  id: string
  isActive?: boolean
  children: React.ReactNode
}> = ({ isActive, children }) => {
  return (
    <StyledContent $isActive={isActive}>
      <ContentInner>{children}</ContentInner>
    </StyledContent>
  )
}

// Add components to Accordion
Accordion.Item = AccordionItem
Accordion.Header = AccordionHeader
Accordion.Content = AccordionContent

// Styled components
const AccordionContainer = styled.div`
  width: 100%;
  max-width: 100%;
  border-radius: 10px;
  overflow: hidden;
`

const AccordionItemWrapper = styled.div<{ $isActive: boolean }>`
  margin-bottom: 8px;
  /* background: #120f1f; */
  border-radius: 8px;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
`

const StyledHeader = styled.div<{ $isActive?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  background: #120f1f;
  transition: all 0.2s ease;
  border-radius: 10px;
  &:hover {
    background: ${({ $isActive }) => ($isActive ? '' : '#2a2742')};
  }
`

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`

const AccordionArrow = styled.div<{ $isActive?: boolean }>`
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  border-radius: 100%;
  align-items: center;
  transform: ${({ $isActive }) => ($isActive ? 'rotate(0deg)' : 'rotate(180deg)')};
  transition: transform 0.2s ease;
  background-color: ${({ $isActive }) => ($isActive ? '#1fd26f' : '#252136')};

  /* svg {
    color: ${({ $isActive }) => ($isActive ? '#1fd26f' : '#ffffff')};
  } */
`

const StyledContent = styled.div<{ $isActive?: boolean }>`
  max-height: ${({ $isActive }) => ($isActive ? '300px' : '0')};
  opacity: ${({ $isActive }) => ($isActive ? '1' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  /* background: #120f1f; */
`

const ContentInner = styled.div`
  padding: 16px 20px;
`

export default Accordion
