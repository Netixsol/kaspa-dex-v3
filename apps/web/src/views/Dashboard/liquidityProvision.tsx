import styled from 'styled-components'
import { Flex, Heading, Text, Box, Button, IconButton, Skeleton } from '@pancakeswap/uikit'
import { DashBox } from './style'
import ProgressBar from './components/ProgressBar'
import HorizontalProgressBar from './components/HorizontalProgressBar'
import TickIcon from './icons/tick.ico'
import { useLiquidityProvision } from './hooks/useLiquidityProvision'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'
import { ProgressBarSkeleton } from './components/Skeleton/ProgressBar'
import { GraphContainerSkeleton } from './components/Skeleton/GraphContainerSkeleton'
import { GainRewardSkeleton } from './components/Skeleton/GainRewardSkeleton'
import { ButtonSkeleton } from './components/Skeleton/ButtonSkeleton'

export const ContentBox = styled(Box)`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
`
export const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`
const LiquidityProvisionSkelton = () => {
  return (
    <>
      {/* 7-Day Liquidity Skeleton */}
      <GraphContainerSkeleton />

      {/* 30-Day Liquidity Skeleton */}
      <GraphContainerSkeleton />

      {/* Wallet Liquidity Skeleton */}
      <DashBox>
        <Flex flexDirection="column" height="100%">
          <Skeleton width={200} height={32} marginBottom="20px" />
          <Flex flexDirection="column" style={{ gap: '40px' }} marginTop="40px" height="100%">
            <Skeleton width="100%" height={60} borderRadius="8px" />
            <Box>
              <Flex justifyContent="space-between" marginBottom="10px">
                <Skeleton width={150} height={20} />
                <Skeleton width={100} height={20} />
              </Flex>
              <Skeleton width="100%" height={8} borderRadius="4px" />
            </Box>
            <Skeleton width="100%" height={48} borderRadius="16px" marginTop="auto" />
          </Flex>
        </Flex>
      </DashBox>

      {/* Initial Liquidity Skeleton */}
      <GainRewardSkeleton />
      <GainRewardSkeleton />
      <GainRewardSkeleton />
    </>
  )
}
const LiquidityProvision = () => {
  const { data, isLoading } = useLiquidityProvision()
  if (isLoading) {
    return (
      <ScreenShortContainer title="Liquidity Provision" isLoading={isLoading}>
        <Flex width="100%" justifyContent="space-between" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px">
          <LiquidityProvisionSkelton />
        </Flex>
        <Flex justifyContent="center" flexGrow={10} width="100%" marginTop="35px">
          <ButtonSkeleton maxWidth="450px" width="33%" />
        </Flex>
      </ScreenShortContainer>
    )
  }
  const { maintain7DayLiquidity, maintain30DayLiquidity, overallLiquidity, rewards } = data
  return (
    <>
      {/* <Flex justifyContent="space-between" alignItems="center">
        <Heading scale="xxl">Liquidity Provision</Heading>
        <IconButton borderRadius="100%" width="48px" height="48px" style={{ padding: '12px' }}>
          <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
        </IconButton>
      </Flex> */}
      <ScreenShortContainer title="Liquidity Provision">
        <Flex width="100%" justifyContent="space-between" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px">
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Maintain 7-Day Liquidity
            </Text>
            <ProgressBar
              colorStart="#5CED9D"
              colorEnd="#1FD26F"
              size={250}
              currentDay={maintain7DayLiquidity?.isInitiated ? maintain7DayLiquidity?.days : 0}
              totalDays={maintain7DayLiquidity?.isInitiated ? maintain7DayLiquidity?.totalDays : 0}
              textColor="#ffffff"
              textSize="3rem"
            />
            <ContentBox marginTop="38px">
              Just 3 more days and <Highlight color="#000000">+50% bonus points</Highlight> are yours!
            </ContentBox>
          </DashBox>
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Maintain 30-Day Liquidity
            </Text>
            <ProgressBar
              colorStart="#5CED9D"
              colorEnd="#1FD26F"
              size={250}
              currentDay={maintain30DayLiquidity?.isInitiated ? maintain30DayLiquidity?.days : 0}
              totalDays={maintain30DayLiquidity?.isInitiated ? maintain30DayLiquidity?.totalDays : 0}
              textColor="#ffffff"
              textSize="3rem"
            />
            <ContentBox marginTop="38px">
              Just 3 more days and <Highlight color="#000000">+50% bonus points</Highlight> are yours!
            </ContentBox>
          </DashBox>
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Maintain 30-Day Liquidity
            </Text>
            <Flex flexDirection="column" style={{ gap: '40px' }} marginTop="40px">
              <ContentBox>
                <Flex justifyContent="space-between" alignItems="center" height="100%">
                  <Text fontSize="16px" fontWeight={500}>
                    Liquidity in Wallet
                  </Text>
                  <Text fontSize="16px" color="primary" fontWeight={500}>
                    {`$${overallLiquidity?.liquidityInWallet ? overallLiquidity?.liquidityInWallet : 0} `}
                  </Text>
                </Flex>
                {/* <HorizontalProgressBar
                progress={(overallLiquidity?.liquidityInWallet / overallLiquidity?.liquidityTarget) * 100}
              /> */}
              </ContentBox>
              <Box>
                <Flex justifyContent="space-between" marginBottom="10px">
                  <Text fontSize="16px" fontWeight={500}>
                    Reward Liquidity Points
                  </Text>
                  <Text fontSize="16px" color="primary" fontWeight={500}>
                    {`${overallLiquidity?.rewardLiquidityPoints ? overallLiquidity?.rewardLiquidityPoints : 0} / $${
                      overallLiquidity?.liquidityTotalPoints ? overallLiquidity?.liquidityTotalPoints : 0
                    } Points`}
                  </Text>
                </Flex>
                <HorizontalProgressBar
                  progress={(overallLiquidity?.rewardLiquidityPoints / overallLiquidity?.liquidityTotalPoints) * 100}
                />
              </Box>
              <Button variant="secondary" style={{ borderRadius: '30px' }}>
                Add Liquidity
              </Button>
            </Flex>
          </DashBox>
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Add Initial Liquidity
            </Text>
            <Flex flexDirection="column" marginTop="20px" style={{ gap: '10px' }}>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    Add Liquidity
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>{`$${
                      rewards?.initialLiquidity?.isInitiated && !rewards?.initialLiquidity?.isGiven
                        ? rewards?.initialLiquidity?.required
                        : 0
                    } USD`}</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background={`#${
                        rewards?.initialLiquidity?.isInitiated && rewards?.initialLiquidity?.isGiven
                          ? '1FD26F'
                          : '45434D'
                      }`}
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
                    Reward:
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>{`${
                      rewards?.initialLiquidity?.isInitiated && !rewards?.initialLiquidity?.isGiven
                        ? rewards?.initialLiquidity?.reward
                        : 0
                    } Points`}</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background={`#${
                        rewards?.initialLiquidity?.isInitiated && rewards?.initialLiquidity?.isGiven
                          ? '1FD26F'
                          : '45434D'
                      }`}
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
            <Text fontSize="24px" fontWeight={500}>
              Add Major Liquidity
            </Text>
            <Flex flexDirection="column" marginTop="20px" style={{ gap: '10px' }}>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    Add Liquidity
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>{`$${
                      rewards?.majorLiquidity?.isInitiated && !rewards?.majorLiquidity?.isGiven
                        ? rewards?.majorLiquidity?.required
                        : 0
                    } USD`}</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background={`#${
                        rewards?.majorLiquidity?.isInitiated && rewards?.majorLiquidity?.isGiven ? '1FD26F' : '45434D'
                      }`}
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
                    Reward:
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>{`${
                      rewards?.majorLiquidity?.isInitiated && !rewards?.majorLiquidity?.isGiven
                        ? rewards?.majorLiquidity?.reward
                        : 0
                    } Points`}</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background={`#${
                        rewards?.majorLiquidity?.isInitiated && rewards?.majorLiquidity?.isGiven ? '1FD26F' : '45434D'
                      }`}
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
            <Text fontSize="24px" fontWeight={500}>
              Add Whale Liquidity
            </Text>
            <Flex flexDirection="column" marginTop="20px" style={{ gap: '10px' }}>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    Add Liquidity
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>{`${
                      rewards?.whaleLiquidity?.isInitiated && !rewards?.whaleLiquidity?.isGiven
                        ? rewards?.whaleLiquidity?.required
                        : 0
                    } USD`}</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background={`#${
                        rewards?.whaleLiquidity?.isInitiated && rewards?.whaleLiquidity?.isGiven ? '1FD26F' : '45434D'
                      }`}
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
                    Reward:
                  </Text>
                  <Flex width="45%" justifyContent="space-between">
                    <Highlight>{`${
                      rewards?.whaleLiquidity?.isInitiated && !rewards?.whaleLiquidity?.isGiven
                        ? rewards?.whaleLiquidity?.reward
                        : 0
                    } Points`}</Highlight>
                    <Flex
                      width={28}
                      height={28}
                      borderRadius="100%"
                      background={`#${
                        rewards?.whaleLiquidity?.isInitiated && rewards?.whaleLiquidity?.isGiven ? '1FD26F' : '45434D'
                      }`}
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
        </Flex>
        <Flex justifyContent="center" flexGrow={10} width="100%" marginTop="35px">
          <Button
            variant="secondary"
            paddingX="auto"
            style={{ flexGrow: 1, maxWidth: '450px', width: '33%', borderRadius: '30px' }}
          >
            Add Liquidity
          </Button>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}

export default LiquidityProvision
