import { Flex, Heading, IconButton, Text } from '@pancakeswap/uikit'
import { DashBox } from './style'
import ProgressBar from './components/ProgressBar'
import { ContentBox, Highlight } from './liquidityProvision'
import { LeaderBoard } from './components/leaderBoard'
import TickIcon from './icons/tick.ico'
import { useTradingSwap } from './hooks/useTradingSwap'
import ScreenShortContainer from './components/CanvasContainer'
import { GraphContainerSkeleton } from './components/Skeleton/GraphContainerSkeleton'
import { GainRewardSkeleton } from './components/Skeleton/GainRewardSkeleton'
import LeaderBoardSkeleton from './components/Skeleton/LeaderBoardSkeleton'

const TradingSwapSkeleton = () => {
  return (
    <Flex width="100%" flexWrap="wrap" justifyContent="space-between" style={{ gap: '32px' }} marginTop="32px">
      <Flex
        flex="1 1 calc(33.33% - 32px)"
        minWidth="280px"
        flexDirection="column"
        alignItems="stretch"
        style={{ gap: '32px' }}
      >
        <GraphContainerSkeleton />
        <GainRewardSkeleton numberOfRewards={1} isPoints={false} />
        <GainRewardSkeleton numberOfRewards={1} isPoints={false} />
      </Flex>
      <Flex
        flex="1 1 calc(33.33% - 32px)"
        minWidth="280px"
        flexDirection="column"
        alignItems="stretch"
        style={{ gap: '32px' }}
      >
        <GraphContainerSkeleton />
        <GainRewardSkeleton numberOfRewards={1} isPoints={false} />
        <GainRewardSkeleton numberOfRewards={1} isPoints={false} />
      </Flex>
      <Flex
        flex="1 1 calc(33.33% - 32px)"
        minWidth="280px"
        flexDirection="column"
        alignItems="stretch"
        style={{ gap: '32px' }}
      >
        <LeaderBoardSkeleton />
      </Flex>
    </Flex>
  )
}
export const TradingSwap = () => {
  const { data, isLoading } = useTradingSwap()
  if (isLoading) {
    return (
      <ScreenShortContainer isLoading={isLoading}>
        <Flex width="100%" flexWrap="wrap" justifyContent="space-between" style={{ gap: '32px' }} marginTop="32px">
          <TradingSwapSkeleton />
        </Flex>
      </ScreenShortContainer>
    )
  }
  return (
    <>
      {/* <Flex justifyContent="space-between" alignItems="center">
        <Heading scale="xxl">Trading & Swaps</Heading>
        <IconButton width="48px" height="48px" style={{ padding: '12px', borderRadius: '100%' }}>
          <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
        </IconButton>
      </Flex> */}
      <ScreenShortContainer title="Trading & Swaps">
        <Flex width="100%" flexWrap="wrap" justifyContent="space-between" style={{ gap: '32px' }} marginTop="32px">
          <Flex
            flex="1 1 calc(33.33% - 32px)"
            minWidth="280px"
            flexDirection="column"
            alignItems="stretch"
            style={{ gap: '32px' }}
          >
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" fontWeight={500}>
                Daily Activity
              </Text>
              <ProgressBar
                colorStart="#5CED9D"
                colorEnd="#1FD26F"
                size={250}
                currentDay={data?.dailyActivity?.todaySwaps}
                totalDays={data?.dailyActivity?.totalSwap}
                textSize="3rem"
              />
              <ContentBox marginTop="38px">
                Just 2 more swaps and <Highlight color="#000000">200 points</Highlight> are yours!
              </ContentBox>
            </DashBox>
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" fontWeight={500} marginBottom="20px">
                First Stake
              </Text>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500} color={data?.firstSwap ? '#1FD26F' : '#45434D'}>
                    500 Points
                  </Text>
                  <Flex
                    width={28}
                    height={28}
                    borderRadius="100%"
                    background={data?.firstSwap ? '#1FD26F' : '#45434D'}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TickIcon width={14} height={10} fill="none" padding="auto" />
                  </Flex>
                </Flex>
              </ContentBox>
            </DashBox>
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" fontWeight={500} marginBottom="20px">
                Cross $10,000 Weekly Volume
              </Text>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500} color={data?.crossTenThousandVolume ? '#1FD26F' : '#45434D'}>
                    500 Points
                  </Text>
                  <Flex
                    width={28}
                    height={28}
                    borderRadius="100%"
                    background={data?.crossTenThousandVolume ? '#1FD26F' : '#45434D'}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TickIcon width={14} height={10} fill="none" padding="auto" />
                  </Flex>
                </Flex>
              </ContentBox>
            </DashBox>
          </Flex>
          <Flex
            flex="1 1 calc(33.33% - 32px)"
            minWidth="280px"
            flexDirection="column"
            alignItems="stretch"
            style={{ gap: '32px' }}
          >
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" fontWeight={500}>
                Weekly Volume
              </Text>
              <ProgressBar
                colorStart="#5CED9D"
                colorEnd="#1FD26F"
                size={250}
                currentDay={4}
                totalDays={7}
                textSize="3rem"
              />
              <ContentBox marginTop="38px">
                Just 3 more days and <Highlight color="#000000">+50% bonus points</Highlight> are yours!
              </ContentBox>
            </DashBox>
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" fontWeight={500} marginBottom="20px">
                Cross $1,000 Weekly Volume
              </Text>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500} color={data?.crossThousandVolume ? '#1FD26F' : '#45434D'}>
                    500 Points
                  </Text>
                  <Flex
                    width={28}
                    height={28}
                    borderRadius="100%"
                    background={data?.crossThousandVolume ? '#1FD26F' : '#45434D'}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TickIcon width={14} height={10} fill="none" padding="auto" />
                  </Flex>
                </Flex>
              </ContentBox>
            </DashBox>
            <DashBox style={{ width: '100%' }}>
              <Text fontSize="24px" fontWeight={500} marginBottom="20px">
                Weekly Volume Leader (Top 50)
              </Text>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    Top 50 will earn 1000 every week
                  </Text>
                </Flex>
              </ContentBox>
            </DashBox>
          </Flex>
          <Flex
            flex="1 1 calc(33.33% - 32px)"
            minWidth="280px"
            flexDirection="column"
            alignItems="stretch"
            style={{ gap: '32px' }}
          >
            <LeaderBoard title="Leaderboard" />
          </Flex>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}
