import { Flex, Heading, Text } from '@pancakeswap/uikit'
import { DashBox } from './style'
import ProgressBar from './components/ProgressBar'
import { ContentBox, Highlight } from './liquidityProvision'
import { LeaderBoard } from './components/leaderBoard'
import TickIcon from './icons/tick.ico'

export const TradingSwap = () => {
  const isDisabled = false
  const isActive = !isDisabled
  return (
    <>
      <Heading scale="xxl">Daily Activity</Heading>
      <Flex width="100%" flexWrap="wrap" justifyContent="space-between" style={{ gap: '32px' }} marginTop="32px">
        <Flex width="69%" style={{ gap: '32px' }} flexWrap="wrap">
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Maintain 7-Day Liquidity
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
              Just 2 more swaps and <Highlight color="#000000">200 points</Highlight> are yours!
            </ContentBox>
          </DashBox>
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Maintain 7-Day Liquidity
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
          <DashBox>
            <Text fontSize="24px" fontWeight={500} marginBottom="20px">
              Current Stake
            </Text>
            <ContentBox>
              <Flex justifyContent="space-between">
                <Text fontSize="16px" fontWeight={500} color="#1FD26F">
                  500 Points
                </Text>
                <Flex
                  width={28}
                  height={28}
                  borderRadius="100%"
                  background={isActive ? '#1FD26F' : '#45434D'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <TickIcon width={14} height={10} fill="none" padding="auto" />
                </Flex>
              </Flex>
            </ContentBox>
          </DashBox>
          <DashBox>
            <Text fontSize="24px" fontWeight={500} marginBottom="20px">
              Cross $1,000 Weekly Volume
            </Text>
            <ContentBox>
              <Flex justifyContent="space-between">
                <Text fontSize="16px" fontWeight={500} color="#1FD26F">
                  500 Points
                </Text>
                <Flex
                  width={28}
                  height={28}
                  borderRadius="100%"
                  background={isActive ? '#1FD26F' : '#45434D'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <TickIcon width={14} height={10} fill="none" padding="auto" />
                </Flex>
              </Flex>
            </ContentBox>
          </DashBox>
          <DashBox>
            <Text fontSize="24px" fontWeight={500} marginBottom="20px">
              Cross $10,000 Weekly Volume
            </Text>
            <ContentBox>
              <Flex justifyContent="space-between">
                <Text fontSize="16px" fontWeight={500} color={isDisabled ? '#1FD26F' : '#45434D'}>
                  500 Points
                </Text>
                <Flex
                  width={28}
                  height={28}
                  borderRadius="100%"
                  background={isDisabled ? '#1FD26F' : '#45434D'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <TickIcon width={14} height={10} fill="none" padding="auto" />
                </Flex>
              </Flex>
            </ContentBox>
          </DashBox>
          <DashBox>
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
        <Flex width="31%" flexGrow={1}>
          <LeaderBoard title="Leaderboard" />
        </Flex>
      </Flex>
    </>
  )
}
