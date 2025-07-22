import { Flex, Heading, Text, IconButton } from '@pancakeswap/uikit'
import { DashBox } from './style'
import { ContentBox } from './liquidityProvision'
import { LeaderBoard } from './components/leaderBoard'
import TickIcon from './icons/tick.ico'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'
import styled from 'styled-components'

const ResponsiveFlex = styled(Flex)`
  @media (max-width: 450px) {
    min-width: 280px;
  }
`

export const OngoingEngagments = () => {
  return (
    <>
      <ScreenShortContainer title="Ongoing Engagement">
        <Flex width="100%" justifyContent="space-between" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px">
          <ResponsiveFlex flex="1 1 calc(33.33% - 32px)" minWidth="390px" alignSelf="start">
            <LeaderBoard title="Leaderboard" />
          </ResponsiveFlex>
          <ResponsiveFlex flex="1 1 calc(33.33% - 32px)" minWidth="390px" alignSelf="start">
            <LeaderBoard title="Community Spotlight" />
          </ResponsiveFlex>
          <ResponsiveFlex
            flex="1 1 calc(33.33% - 32px)"
            flexDirection="column"
            minWidth="390px"
            style={{ gap: '32px' }}
            alignSelf="start"
          >
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" marginBottom="23px" fontWeight={500}>
                Milestone Celebration
              </Text>
              <Flex flexDirection="column" style={{ gap: '20px' }}>
                <ContentBox>
                  <Flex justifyContent="space-between" style={{ gap: '3px' }}>
                    <Text fontSize="16px" fontWeight={500} textAlign="start">
                      You’ve completed 10 swaps
                    </Text>

                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background="#1FD26F"
                      justifyContent="center"
                      alignItems="center"
                      flexShrink={0}
                    >
                      <TickIcon width={14} height={10} fill="none" padding="auto" />
                    </Flex>
                  </Flex>
                </ContentBox>
                <ContentBox>
                  <Flex justifyContent="space-between" style={{ gap: '3px' }}>
                    <Text fontSize="16px" fontWeight={500} textAlign="start">
                      Staking Streak 5/7
                    </Text>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background="#45434D"
                      justifyContent="center"
                      alignItems="center"
                      flexShrink={0}
                    >
                      <TickIcon width={14} height={10} fill="none" padding="auto" />
                    </Flex>
                  </Flex>
                </ContentBox>
              </Flex>
            </DashBox>
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" marginBottom="23px" fontWeight={500}>
                Behind-the-scenes development updates
              </Text>
              <Flex flexDirection="column" style={{ gap: '20px' }}>
                <ContentBox>
                  <Flex justifyContent="space-between" style={{ gap: '3px' }}>
                    <Text fontSize="16px" fontWeight={500} textAlign="start">
                      Auto-compounding for yield pools in final testing
                    </Text>

                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background="#1FD26F"
                      justifyContent="center"
                      alignItems="center"
                      flexShrink={0}
                    >
                      <TickIcon width={14} height={10} fill="none" padding="auto" />
                    </Flex>
                  </Flex>
                </ContentBox>
                <ContentBox>
                  <Flex justifyContent="space-between" style={{ gap: '3px' }}>
                    <Text fontSize="16px" fontWeight={500} textAlign="start">
                      Fixed a critical bug in the Kaspa Testnet
                    </Text>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background="#45434D"
                      justifyContent="center"
                      alignItems="center"
                      flexShrink={0}
                    >
                      <TickIcon width={14} height={10} fill="none" padding="auto" />
                    </Flex>
                  </Flex>
                </ContentBox>
              </Flex>
            </DashBox>
          </ResponsiveFlex>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}
