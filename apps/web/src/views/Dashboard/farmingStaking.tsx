import { Button, Flex, Text } from '@pancakeswap/uikit'
import { DashBox } from './style'
import ProgressBar from './components/ProgressBar'
import { ContentBox, Highlight } from './liquidityProvision'
import TickIcon from './icons/tick.ico'
import PcIcon from './icons/pc.ico'
import { useFarmingStaking } from './hooks/useFarmingStaking'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'

const FarmingStaking = () => {
  const { data, isLoading } = useFarmingStaking()
  const { firstStake, longTermFarming, maximumFarming } = !isLoading && data !== undefined ? data : {}
  return (
    <>
      <ScreenShortContainer title="Farming & Staking">
        <Flex width="100%" justifyContent="space-between" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px">
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Long-term Farming
            </Text>
            <ProgressBar
              colorStart="#5CED9D"
              colorEnd="#1FD26F"
              size={250}
              currentDay={longTermFarming?.isInitiated ? longTermFarming?.days : 0}
              totalDays={longTermFarming?.isInitiated ? longTermFarming?.totalDays : 0}
              textColor="#ffffff"
              textSize="3rem"
            />
            <ContentBox marginTop="38px">
              Just {longTermFarming?.remainingDays} more days and <Highlight>750 points</Highlight> are yours!
            </ContentBox>
          </DashBox>
          <DashBox>
            <Text fontSize="24px" fontWeight={500}>
              Maximum Farming
            </Text>
            <ProgressBar
              colorStart="#5CED9D"
              colorEnd="#1FD26F"
              size={250}
              currentDay={maximumFarming?.isInitiated ? maximumFarming?.days : 0}
              totalDays={maximumFarming?.isInitiated ? maximumFarming?.totalDays : 0}
              textColor="#ffffff"
              textSize="3rem"
            />
            <ContentBox marginTop="38px">
              Just {maximumFarming?.remainingDays} more days and <Highlight color="#000000">1500 points</Highlight> are
              yours!
            </ContentBox>
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
                Current Stake
              </Text>
            </Flex>
            <Flex flexDirection="column" marginTop="20px" style={{ gap: '10px' }} height="78%">
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="16px" fontWeight={500}>
                    Check Stake LP Tokens (First Time)
                  </Text>
                  <Flex
                    width={28}
                    height={28}
                    borderRadius="100%"
                    background={firstStake ? '#1FD26F' : '#45434D'}
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
                    Get Reward
                  </Text>
                  <Highlight>300 Points</Highlight>
                </Flex>
              </ContentBox>
              <Button marginTop="auto" variant="secondary" style={{ borderRadius: '30px' }}>
                Check Stake
              </Button>
            </Flex>
          </DashBox>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}

export default FarmingStaking
