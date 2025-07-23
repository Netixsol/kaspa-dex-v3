import { Flex, Box, Text } from '@pancakeswap/uikit'
import { FC } from 'react'
import styled from 'styled-components'
import SideBar from './components/Sidebar'
import FireIcon from './icons/fire.ico'
import EarningHistoryDropdown from './components/DropdownMenu'
import { useEarningPointHistory } from './hooks/useEarningPointHistory'
import { useGetPermissions } from './hooks/useGetPermission'
import { useRewardPoints } from './hooks/useRewardPoints'
import { useGetToken } from './hooks/useGetToken'

const Page = styled.div`
  background: transparent;
  padding: 20px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  @media (min-width: 768px) {
  padding: 43px 64px;
  }
`

function formatNumberWithCommas(value) {
  const num = Number(value)
  if (isNaN(num)) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const DashboardPageLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { data, isLoading } = useEarningPointHistory({ page: 1, limit: 8, type: 'ALL' })
  const { data: pointsData } = useRewardPoints()
  const {} = useGetToken()
  useGetPermissions()
  return (
    <>
      <Flex width="100%" height="100%" position="relative">
        <SideBar />
        <Page>
          <Flex
            justifyContent="space-between"
            marginBottom="54px"
            style={{ columnGap: '32px', rowGap: '20px' }}
            flexWrap="wrap"
          >
            <Flex
              background="#252136"
              paddingX="10px"
              borderRadius="10px"
              justifyContent="space-between"
              paddingY="8px"
              flexDirection={['column', null, 'row']}
              flex="1 1 calc(66.66% - 32px)"
            >
              <Flex alignItems="center" style={{ gap: '10px' }} mb={['8px', null, '0px']}>
                <Box width="38px" height="38px" borderRadius="100%" overflow="hidden">
                  <img alt="user avatar" src="/images/nfts/baller-lg.png" width="100%" style={{ objectFit: 'cover' }} />
                </Box>
                <Text color="#1FD26F">@{pointsData ? pointsData?.data?.userName : 'Twitter_User_Name'}</Text>
              </Flex>
              <Flex alignItems="center" style={{ gap: '10px' }}>
                <Text color="#1FD26F" fontSize={['16px', null, '18px', '20px']} fontWeight={500}>
                  {pointsData ? formatNumberWithCommas(pointsData?.data?.points) : '0'} Total Points
                </Text>
                <Flex
                  borderRadius="20px"
                  height={['32px', null, '40px']}
                  paddingX={['10px', null, '13px', '20px']}
                  background="#120F1F"
                  alignItems="center"
                >
                  <FireIcon width="18" height="26" viewBox="0 0 22 31" fill="none" color="#1FD26F" />
                  <Text fontSize={['16px', null, '18px', '20px']} ml={['5px', null, '8px', '15px']} fontWeight={500}>
                    {pointsData ? pointsData?.data?.streak : 0} Streak
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex flex="1 1 calc(33.33% - 32px)">
              <EarningHistoryDropdown earnings={data?.historyList} isLoading={isLoading} />
            </Flex>
          </Flex>
          {children}
        </Page>
      </Flex>
    </>
  )
}