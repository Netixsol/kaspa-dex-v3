import { Button, Flex, Heading, IconButton, Text } from '@pancakeswap/uikit'
import { DashBox } from './style'
import { ContentBox } from './liquidityProvision'
import TickIcon from './icons/tick.ico'
import InfulencerPartnershipTable from './components/Tables/InfulencerPartnershipTable'
import DigitalTimer from './components/timer'
import Accordion from './components/Accrodian'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'
import styled from 'styled-components'

const ResponsiveFlex = styled(Flex)`
  @media (max-width: 450px) {
    min-width: 280px;
  }
`

export const PreLaunch = () => {
  return (
    <>
      <ScreenShortContainer title="Pre-Launch">
        <Flex width="100%" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px" flexBasis="content">
          <ResponsiveFlex
            flex="1 1 calc(33.33% - 32px)"
            minWidth="390px"
            flexDirection="column"
            alignItems="stretch"
            style={{ gap: '32px' }}
          >
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
                Teasers and countdown campaigns
              </Text>
              <Flex flexDirection="column" style={{ gap: '20px' }}>
                <ContentBox style={{ paddingBlock: '20px' }}>
                  <DigitalTimer
                    initialTime={86400} // 24 hours in seconds
                    onComplete={() => console.log('Timer finished!')}
                  />
                </ContentBox>
                <Button variant="secondary" style={{ borderRadius: '30px' }}>
                  Check Twitter/X
                </Button>
              </Flex>
            </DashBox>
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" marginBottom="23px" fontWeight={500}>
                Community challenges and contests
              </Text>
              <Flex flexDirection="column" style={{ gap: '20px' }}>
                <ContentBox>
                  <Flex justifyContent="space-between">
                    <Text fontSize="16px" fontWeight={500}>
                      Photo Contest
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
                <ContentBox>
                  <Flex justifyContent="space-between">
                    <Text fontSize="16px" fontWeight={500}>
                      Complete Quizzes
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
                <Button variant="secondary" style={{ borderRadius: '30px' }}>
                  Join the Challenge{' '}
                </Button>
              </Flex>
            </DashBox>
          </ResponsiveFlex>
          <ResponsiveFlex flex="1 1 calc(33.33% - 32px)" minWidth="390px" alignSelf="start">
            <DashBox>
              <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
                Influencer Partnerships
              </Text>
              <InfulencerPartnershipTable />
            </DashBox>
          </ResponsiveFlex>
          <ResponsiveFlex flex="1 1 calc(33.33% - 32px)" minWidth="390px" alignSelf="start">
            <DashBox>
              <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
                Kasplex & Layer 2 Benefits Explained
              </Text>
              <Flex flexDirection="column" style={{ gap: '20px' }}>
                <ContentBox>
                  <Text fontSize="16px" fontWeight={500} textAlign="left">
                    Educational content about Kasplex and Layer 2 benefits
                  </Text>
                </ContentBox>
                <Accordion>
                  <Accordion.Item id="1">
                    <Accordion.Header id="1">
                      <Text fontWeight="500">What is Kasplex?</Text>
                    </Accordion.Header>
                    <Accordion.Content id="1">
                      <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item id="2">
                    <Accordion.Header id="2">
                      <Text fontWeight="500">How to Participate ?</Text>
                    </Accordion.Header>
                    <Accordion.Content id="2">
                      <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </Flex>
            </DashBox>
          </ResponsiveFlex>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}
