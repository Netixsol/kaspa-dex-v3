import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { DashBox } from './style'
import { ContentBox as OldContentBox, Highlight } from './liquidityProvision'
import TickIcon from './icons/tick.ico'

const ContentBox = styled(OldContentBox)`
  text-align: start;
`
const MilstoneRewards = () => {
  return (
    <>
      <Heading scale="xxl">Bonus Quests & Milestone Rewards</Heading>
      <Flex
        width="100%"
        justifyContent="space-between"
        flexWrap="wrap"
        style={{ gap: '32px' }}
        marginTop="32px"
        marginBottom="32px"
      >
        <DashBox display="flex" style={{ flexDirection: 'column' }}>
          <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
            Daily Spin/Dice Roll
          </Text>
          <Flex flexDirection="column" style={{ gap: '20px' }} flexGrow={1}>
            <ContentBox>
              Spin the wheel or roll the dice to win <Highlight color="#000000">500 to 2000 Points</Highlight>
            </ContentBox>
            <ContentBox style={{ flexGrow: 1, alignContent: 'center' }}>
              Today’s Bonus: 1.5x multiplier on <Highlight color="#000000">reward</Highlight>
            </ContentBox>
            <Button variant="secondary" marginTop="auto">
              Spin or Roll
            </Button>
          </Flex>
        </DashBox>
        <DashBox display="flex" style={{ flexDirection: 'column' }}>
          <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
            Bug Reports (Valid)
          </Text>
          <Flex flexDirection="column" style={{ gap: '20px' }} flexGrow={1}>
            <ContentBox style={{ flexGrow: 1, alignContent: 'center' }}>
              A valid bug report to win <Highlight color="#000000">500 to 2000 Points</Highlight>
            </ContentBox>
            <ContentBox style={{ flexGrow: 1, alignContent: 'center' }}>
              Today’s Bonus: 1.5x multiplier on <Highlight color="#000000">reward</Highlight>
            </ContentBox>
            <Button variant="secondary" marginTop="auto">
              Report a Bug
            </Button>
          </Flex>
        </DashBox>
        <DashBox>
          <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
            1.5X Multiplier
          </Text>
          <Flex flexDirection="column" style={{ gap: '20px' }}>
            <ContentBox>
              <Flex justifyContent="space-between">
                <Text fontSize="16px" fontWeight={500}>
                  Social Sharing
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
                  Consistent 7 Days
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
            <Button variant="secondary">Check Twitter/X</Button>
          </Flex>
        </DashBox>
      </Flex>
      <Heading scale="xxl">Milestone Stages</Heading>
      <Flex width="100%" justifyContent="space-between" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px">
        <DashBox display="flex" style={{ flexDirection: 'column' }}>
          <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
            <Highlight>Stage 1:</Highlight> Genesis Explorer
          </Text>
          <Flex flexDirection="column" style={{ gap: '20px' }} flexGrow={1}>
            <ContentBox>
              Complete all basic actions:
              <br />
              <Highlight color="#000000">1,000 bonus points</Highlight>
            </ContentBox>
            <ContentBox>
              Be among first 100 liquidity providers: <br />
              <Highlight color="#000000">2,000 Bonus Points</Highlight>
            </ContentBox>
            <Button variant="secondary" marginTop="auto">
              Add Liquidity
            </Button>
          </Flex>
        </DashBox>
        <DashBox display="flex" style={{ flexDirection: 'column' }}>
          <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
            <Highlight>Stage 2 :</Highlight> Volume Champion
          </Text>
          <Flex flexDirection="column" style={{ gap: '20px' }} flexGrow={1}>
            <ContentBox>
              Achieve highest weekly trading volume: <br />
              <Highlight color="#000000">3,000 Bonus Points</Highlight>
            </ContentBox>
            <ContentBox>
              Complete 50+ swaps: <br />
              <Highlight color="#000000">1,000 Bonus Points</Highlight>
            </ContentBox>
            <Button variant="secondary" marginTop="auto">
              Swap Now
            </Button>
          </Flex>
        </DashBox>
        <DashBox display="flex" style={{ flexDirection: 'column' }}>
          <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
            <Highlight>Stage 3 :</Highlight> Farming Pioneer
          </Text>
          <Flex flexDirection="column" style={{ gap: '20px' }} flexGrow={1}>
            <ContentBox>
              Stake in all available farms:
              <br />
              <Highlight color="#000000">1,500 Bonus Points</Highlight>
            </ContentBox>
            <ContentBox>
              Stake KASFI & Earn Points via Referrals <br />
              <Highlight color="#000000">3,000 Bonus Points</Highlight>
            </ContentBox>
            <ContentBox>
              Consistent for staking continued 7 Days
              <br />
              <Highlight color="#000000">5,000 Bonus Points</Highlight>
            </ContentBox>
            <Button variant="secondary" marginTop="auto">
              Refer with your Friends
            </Button>
          </Flex>
        </DashBox>
      </Flex>
    </>
  )
}

export default MilstoneRewards
