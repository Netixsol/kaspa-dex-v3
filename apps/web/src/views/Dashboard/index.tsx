import { Flex, Box, Text, Skeleton } from '@pancakeswap/uikit'
import { FC } from 'react'
import styled from 'styled-components'
import SideBar from './components/Sidebar'
import FireIcon from './icons/fire.ico'
import EarningHistoryDropdown, { EarningHistoryDropdownSkeleton } from './components/DropdownMenu'
import { useGetPermissions } from './hooks/useGetPermission'
import { useRewardPoints } from './hooks/useRewardPoints'
import { useEarningPointHistory } from './hooks/useEarningPointHistory'
// import { useGetToken } from './hooks/useGetToken'

const Page = styled('div')`
  background: transparent;
  padding: 55px 64px;
  width: 100%;
`

function formatNumberWithCommas(value) {
  const num = Number(value)
  if (isNaN(num)) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const PointsDisplaySkeleton = () => {
  return (
    <Flex
      background="#252136"
      paddingX="10px"
      borderRadius="10px"
      justifyContent="space-between"
      paddingY="8px"
      flex="1 1 calc(66.66% - 32px)"
    >
      {/* Left side - User info */}
      <Flex alignItems="center" style={{ gap: '10px' }}>
        <Skeleton width={38} height={38} variant="circle" />
        <Skeleton width={120} height={20} />
      </Flex>

      {/* Right side - Points and streak */}
      <Flex alignItems="center" style={{ gap: '10px' }}>
        <Skeleton width={150} height={28} />
        <Flex
          borderRadius="20px"
          height="40px"
          paddingX="20px"
          background="#120F1F"
          alignItems="center"
          style={{ gap: '15px' }}
        >
          <Skeleton width={22} height={31} />
          <Skeleton width={60} height={28} />
        </Flex>
      </Flex>
    </Flex>
  )
}
export const DashboardPageLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { data, isLoading } = useEarningPointHistory({ page: 1, limit: 8, type: 'ALL' })
  const { data: pointsData } = useRewardPoints()
  // const {} = useGetToken()
  const { data: permissions, isLoading: isPermissionsLoading } = useGetPermissions()
  return (
    <>
      <Flex width="100%" height="100%">
        <SideBar permissions={permissions} isLoading={isPermissionsLoading} />
        <Page>
          <Flex justifyContent="space-between" marginBottom="54px" style={{ gap: '32px' }} flexWrap="wrap">
            {isLoading ? (
              <PointsDisplaySkeleton />
            ) : (
              <Flex
                background="#252136"
                paddingX="10px"
                borderRadius="10px"
                justifyContent="space-between"
                paddingY="8px"
                flex="1 1 calc(66.66% - 32px)"
              >
                <Flex alignItems="center" style={{ gap: '10px' }}>
                  <Box width="38px" height="38px" borderRadius="100%" overflow="hidden">
                    <img
                      alt="user avatar"
                      src="/images/nfts/baller-lg.png"
                      width="100%"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                  <Text color="#1FD26F">@{pointsData ? pointsData?.data?.userName : 'Twitter User Name'}</Text>
                </Flex>
                <Flex alignItems="center" style={{ gap: '10px' }}>
                  <Text color="#1FD26F" fontSize="24px" fontWeight={500}>
                    {pointsData ? formatNumberWithCommas(pointsData?.data?.points) : '0'} Total Points
                  </Text>
                  <Flex
                    borderRadius="20px"
                    height="40px"
                    paddingX="20px"
                    background="#120F1F"
                    alignItems="center"
                    style={{ gap: '15px' }}
                  >
                    <FireIcon width="22" height="31" viewBox="0 0 22 31" fill="none" color="#1FD26F" />
                    <Text fontSize="24px" fontWeight={500}>
                      {pointsData ? pointsData?.data?.streak : 0} Streak
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            )}
            <Flex flex="1 1 calc(33.33% - 32px)">
              {isLoading ? <EarningHistoryDropdownSkeleton /> : <EarningHistoryDropdown earnings={data?.historyList} />}
            </Flex>
          </Flex>
          {children}
        </Page>
      </Flex>
    </>
  )
}
