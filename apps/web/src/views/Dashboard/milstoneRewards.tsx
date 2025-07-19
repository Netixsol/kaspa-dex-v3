import { Button, Flex, Heading, IconButton, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import styled from 'styled-components'
import { DashBox } from './style'
import { ContentBox as OldContentBox, Highlight } from './liquidityProvision'
import TickIcon from './icons/tick.ico'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'

const ContentBox = styled(OldContentBox)`
  text-align: start;
`
const MilstoneRewards = () => {
  return (
    <>
      {/* <Flex justifyContent="space-between" alignItems="center">
        <Heading scale="xxl">Bonus Quests & Milestone Rewards</Heading>
        <IconButton borderRadius="100%" width="48px" height="48px" style={{ padding: '12px' }}>
          <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
        </IconButton>
      </Flex> */}
      <ScreenShortContainer title="Bonus Quests & Milestone Rewards">
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
              <Link href="/dashboard/daily-spin" passHref>
                <Button as="a" variant="secondary" marginTop="auto" width="100%" style={{ borderRadius: '30px' }}>
                  Spin or Roll
                </Button>
              </Link>
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
              <Link href="/dashboard/report-bug" passHref>
                <Button as="a" variant="secondary" marginTop="auto" width="100%" style={{ borderRadius: '30px' }}>
                  Report a Bug
                </Button>
              </Link>
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
              <Link href="https://x.com/KaspaFinance" passHref target="_blank">
                <Button as="a" variant="secondary" target="_blank" width="100%" style={{ borderRadius: '30px' }}>
                  Check Twitter/X
                </Button>
              </Link>
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
              <Link href="http://localhost:3000/liquidity?chainId=167012" passHref style={{ marginTop: 'auto' }}>
                <Button as="a" width="100%" variant="secondary" marginTop="auto" style={{ borderRadius: '30px' }}>
                  Add Liquidity
                </Button>
              </Link>
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
              <Link href="http://localhost:3000/swap" passHref style={{ marginTop: 'auto' }}>
                <Button as="a" width="100%" variant="secondary" marginTop="auto" style={{ borderRadius: '30px' }}>
                  Swap Now
                </Button>
              </Link>
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
              <Link href="https://t.me/KaspaFinanceIO" target="_blank" passHref style={{ marginTop: 'auto' }}>
                <Button as="a" width="100%" variant="secondary" style={{ borderRadius: '30px' }}>
                  Refer with your Friends
                </Button>
              </Link>
            </Flex>
          </DashBox>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}

export default MilstoneRewards
