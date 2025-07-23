import { Box, Button, Flex, Heading, IconButton, Image, ModalV2, Skeleton } from '@pancakeswap/uikit'
import { TwitterShareButton } from 'react-share'
import html2canvas from 'html2canvas'
import { useRef, useState } from 'react'
import { ShareIcon } from '../icons/share.ico'
import { DashBox } from '../style'
import CrossIcon from '../icons/cross.ico'
import { CrossIconBtn } from './LoginModal'

const ScreenShortContainer = ({ children, title, isLoading }: any) => {
  const screenShortRef = useRef<any>()
  const [isOpen, setIsOpen] = useState(false)
  const [screenShort, setScreenShort] = useState(null)
  const handleCapture = async () => {
    const screenshort = await html2canvas(screenShortRef?.current, {
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#120F1F',
    })

    const screenshortURL = screenshort.toDataURL('image/png')
    setIsOpen(true)
    setScreenShort(screenshortURL)
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        {isLoading ? (
          <>
            <Skeleton width="40%" height={70} /> {/* Simulates the heading */}
            <Skeleton width={48} height={48} variant="circle" /> {/* Simulates the circular button */}
          </>
        ) : (
          <>
            <Heading scale="xxl">{title}</Heading>
            <IconButton
              width="48px"
              height="48px"
              style={{ padding: '12px', borderRadius: '100%' }}
              onClick={handleCapture}
            >
              <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
            </IconButton>
          </>
        )}
      </Flex>
      <Box ref={screenShortRef}>
        <ModalV2 isOpen={isOpen}>
          <Flex alignItems="center" justifyContent="center" width="600px" zIndex={999}>
            <DashBox width="100%">
              <Flex justifyContent="end">
                <CrossIconBtn onClick={() => setIsOpen(false)}>
                  <CrossIcon width="10" height="10" viewBox="0 0 10 10" fill="none" />
                </CrossIconBtn>
              </Flex>
              <Image src={screenShort} width={600} height={300} />
              <Flex justifyContent="center">
                <Button scale="md" width="60%" variant="secondary" marginTop="20px">
                  <TwitterShareButton
                    url={encodeURIComponent(screenShort)}
                    title={title}
                    via=""
                    hashtags={['Kespa', 'kespa finance']}
                  >
                    Share Now
                  </TwitterShareButton>
                </Button>
              </Flex>
            </DashBox>
          </Flex>
        </ModalV2>
        {children}
      </Box>
    </>
  )
}

export default ScreenShortContainer
