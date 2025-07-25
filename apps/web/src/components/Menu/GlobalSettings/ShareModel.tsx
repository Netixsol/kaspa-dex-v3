import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, Flex, FlexGap, TelegramIcon, Button } from '@pancakeswap/uikit'
import CopyIcon from 'components/Icons/CopyIcon'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

export const ShareModel = ({ onDismiss, link }: any) => {
  // get current url
  // const url = window.location.href
  const url = link ? window.location.origin + link : window.location.href

  const [, setCopied] = useState('Text to copy')

  function setcopied(value: string) {
    setCopied(value)
    navigator.clipboard.writeText(value)
  }

  const [Textcopied, setTextCopied] = useState(false)
  useEffect(() => {
    if (Textcopied) {
      setTimeout(() => {
        setTextCopied(false)
      }, 3000)
    }
  }, [Textcopied])

  return (
    <Modal title="Share" headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <ScrollableContainer>
        <FlexGap justifyContent="center" gap="1rem" alignItems="center">
          <a href={`https://t.me/share/url?url=${url}`} target="_blank" rel="noreferrer">
            <TelegramIcon />
          </a>

          {/* <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noreferrer">
            <LinkedIn />
          </a> */}

          <Button
            onClick={() => {
              setcopied(url)
              setTextCopied(true)
            }}
            width="100%"
          >
            <CopyIcon />
            {Textcopied ? 'Copied' : 'Copy'}
          </Button>
        </FlexGap>
      </ScrollableContainer>
    </Modal>
  )
}
