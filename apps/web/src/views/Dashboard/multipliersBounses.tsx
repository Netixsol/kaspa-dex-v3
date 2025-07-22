import { Button, Flex, Heading, IconButton, Text } from '@pancakeswap/uikit'
import { DashBox } from './style'
import { ContentBox, Highlight } from './liquidityProvision'
import TickIcon from './icons/tick.ico'
import PcIcon from './icons/pc.ico'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'

const MultipliersBounsesPage = () => {
  return (
    <>
      <ScreenShortContainer title="Multipliers & Bonuses">
        <Flex width="100%" justifyContent="space-between" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px">
          <DashBox>
            <Flex alignItems="center" style={{ gap: '20px' }}>
              <Flex
                justifyContent="center"
                width="53px"
                height="53px"
                alignItems="center"
                background="#1FD26F"
                borderRadius="100%"
              >
                <PcIcon width="28" height="24" viewBox="0 0 28 24" fill="none" />
              </Flex>
              <Text fontSize="24px" fontWeight={500}>
                Early Bird Multiplier
              </Text>
            </Flex>
            <Flex flexDirection="column" marginTop="20px" style={{ gap: '10px' }}>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    For first 48 hours:
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>1.5x points</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background="#1FD26F"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TickIcon width={14} height={10} fill="none" padding="auto" />
                    </Flex>
                  </Flex>
                </Flex>
              </ContentBox>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    Time Left:
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>12h 22m</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background="#1FD26F"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TickIcon width={14} height={10} fill="none" padding="auto" />
                    </Flex>
                  </Flex>
                </Flex>
              </ContentBox>
            </Flex>
          </DashBox>
          <DashBox>
            <Flex alignItems="center" style={{ gap: '20px' }}>
              <Flex
                justifyContent="center"
                width="53px"
                height="53px"
                alignItems="center"
                background="#1FD26F"
                borderRadius="100%"
              >
                <PcIcon width="28" height="24" viewBox="0 0 28 24" fill="none" />
              </Flex>
              <Text fontSize="24px" fontWeight={500}>
                Consistency Bonus
              </Text>
            </Flex>
            <Flex flexDirection="column" marginTop="20px" style={{ gap: '10px' }}>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    Daily Streak:
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>7 Days</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background="#1FD26F"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TickIcon width={14} height={10} fill="none" padding="auto" />
                    </Flex>
                  </Flex>
                </Flex>
              </ContentBox>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    +20% for Daily Activity
                  </Text>
                  <Flex
                    width={28}
                    height={28}
                    borderRadius="100%"
                    background="#1FD26F"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TickIcon width={14} height={10} fill="none" padding="auto" />
                  </Flex>
                </Flex>
              </ContentBox>
            </Flex>
          </DashBox>
          <DashBox>
            <Flex alignItems="center" style={{ gap: '20px' }}>
              <Flex
                justifyContent="center"
                width="53px"
                height="53px"
                alignItems="center"
                background="#1FD26F"
                borderRadius="100%"
              >
                <PcIcon width="28" height="24" viewBox="0 0 28 24" fill="none" />
              </Flex>
              <Text fontSize="24px" fontWeight={500}>
                Whale Bonus
              </Text>
            </Flex>
            <Flex flexDirection="column" marginTop="20px" style={{ gap: '10px' }}>
              <ContentBox>
                <Text textAlign="left">
                  Large Transaction Detected Bonus MultMultiplier: <Highlight>01.2X</Highlight>
                </Text>
              </ContentBox>
            </Flex>
          </DashBox>
        </Flex>
        <Flex justifyContent="center" flexGrow={10} width="100%" marginTop="35px">
          <Button
            variant="secondary"
            paddingX="auto"
            style={{ flexGrow: 1, maxWidth: '450px', width: '33%', borderRadius: '30px' }}
          >
            View my Bonuses
          </Button>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}

export default MultipliersBounsesPage
