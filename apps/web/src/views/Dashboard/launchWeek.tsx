import { Button, Flex, Heading, IconButton, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import { LeaderBoard } from './components/leaderBoard'
import { DashBox } from './style'
import { ContentBox, Highlight } from './liquidityProvision'
import { ShareIcon } from './icons/share.ico'
import ScreenShortContainer from './components/CanvasContainer'

export const LaunchWeek = () => {
  return (
    <>
      {/* <Flex justifyContent="space-between" alignItems="center">
        <Heading scale="xxl">Launch Week</Heading>
        <IconButton borderRadius="100%" width="48px" height="48px" style={{ padding: '12px' }}>
          <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
        </IconButton>
      </Flex> */}
      <ScreenShortContainer title="Launch Week">
        <Flex width="100%" justifyContent="space-between" flexWrap="wrap" style={{ gap: '32px' }} marginTop="32px">
          <Flex flex="1 1 calc(33.33% - 32px)" minWidth="280px" alignSelf="start">
            <LeaderBoard title="Leaderboard" />
          </Flex>
          <Flex flex="1 1 calc(33.33% - 32px)" minWidth="280px" alignSelf="start">
            <DashBox display="flex" style={{ flexDirection: 'column' }}>
              <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
                Daily Twitter Spaces
              </Text>
              <Flex flexDirection="column" style={{ gap: '20px' }} flexGrow={1}>
                <ContentBox style={{ flexGrow: 1, alignContent: 'center' }}>
                  <Text textAlign="start">
                    New Features Overview on <Highlight color="#000000">Twitter</Highlight>
                  </Text>
                </ContentBox>
                <ContentBox style={{ flexGrow: 1, alignContent: 'center' }}>
                  <Text textAlign="start">
                    New Campaigns Overview on <Highlight color="#000000">Twitter</Highlight>
                  </Text>
                </ContentBox>
                <Link href="/dashboard/report-bug" passHref>
                  <Button as="a" variant="secondary" marginTop="auto" width="100%">
                    Check Twitter/X
                  </Button>
                </Link>
              </Flex>
            </DashBox>
          </Flex>
          <Flex flex="1 1 calc(33.33% - 32px)" minWidth="280px" alignSelf="start">
            <DashBox display="flex" style={{ flexDirection: 'column' }}>
              <Text fontSize="24px" marginBottom="38px" fontWeight={500}>
                Live Campaign Updates
              </Text>
              <Flex flexDirection="column" style={{ gap: '20px' }} flexGrow={1}>
                <ContentBox style={{ padding: '14px 26px' }}>
                  <Flex justifyContent="space-between">
                    <Text>New Users Joined: </Text>
                    <Text color="#1fd26f">1000 Users</Text>
                  </Flex>
                </ContentBox>
                <ContentBox style={{ padding: '14px 26px' }}>
                  <Flex justifyContent="space-between">
                    <Text>{`Total Participant's:`} </Text>
                    <Text color="#1fd26f">67k</Text>
                  </Flex>
                </ContentBox>
                <Link href="/dashboard/report-bug" passHref>
                  <Button as="a" variant="secondary" marginTop="auto" width="100%">
                    Check Twitter/X
                  </Button>
                </Link>
              </Flex>
            </DashBox>
          </Flex>
        </Flex>
      </ScreenShortContainer>
    </>
  )
}
