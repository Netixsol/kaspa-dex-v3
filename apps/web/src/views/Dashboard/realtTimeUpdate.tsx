import { Box, Button, Flex, Heading, IconButton, Text } from '@pancakeswap/uikit'
import { LeaderBoard } from './components/leaderBoard'
import { DashBox } from './style'
import HorizontalProgressBar from './components/HorizontalProgressBar'
import { ContentBox, Highlight } from './liquidityProvision'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'

export const RealTimeUpdate = () => {
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading scale="xxl">Real-Time Updates</Heading>
        <IconButton width="48px" height="48px" style={{ padding: '12px', borderRadius: "100%" }}>
          <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
        </IconButton>
      </Flex>
      <ScreenShortContainer title="Real-Time Updates">
        <Flex width="100%" justifyContent="space-between" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px">
          <LeaderBoard title="Live Campaign Rankings" />
          <DashBox style={{ flexGrow: 15, alignSelf: 'start' }}>
            <Text fontSize="24px" fontWeight={500}>
              Weekly Tier Snapshots
            </Text>
            <Flex flexDirection="column" justifyContent="center" style={{ gap: '20px' }} marginTop="40px">
              <ContentBox style={{ padding: '14px 26px' }}>
                <Flex justifyContent="space-between">
                  <Text>Current Tier: </Text>
                  <Text color="#1fd26f">Gold </Text>
                </Flex>
              </ContentBox>
              <Box marginBottom="8px">
                <Flex justifyContent="space-between" marginBottom="10px">
                  <Text fontSize="16px" fontWeight={500}>
                    Reward Liquidity Points
                  </Text>
                  <Text fontSize="16px" color="primary" fontWeight={500}>
                    200/ $2000
                  </Text>
                </Flex>
                <HorizontalProgressBar progress={(200 / 2000) * 100} />
              </Box>
              <ContentBox style={{ padding: '14px 26px' }}>
                <Flex justifyContent="space-between">
                  <Text>Snapshot in: </Text>
                  <Text color="#1fd26f">2d 12h 33m</Text>
                </Flex>
              </ContentBox>
              <ContentBox style={{ padding: '14px 26px' }}>
                <Flex justifyContent="space-between">
                  <Text>Reach Platinum to Unlock:</Text>
                  <Text color="#1fd26f">+10 Bonus Multiplier </Text>
                </Flex>
              </ContentBox>
              <Button width="50%" marginTop="16px" variant="secondary" style={{ alignSelf: 'center' }}>
                Swap Now
              </Button>
              <Text textAlign="center">
                Swap now to earn more <Highlight>Points</Highlight>{' '}
              </Text>
            </Flex>
          </DashBox>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}
