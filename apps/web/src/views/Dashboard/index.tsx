import { Flex, Box, Text } from '@pancakeswap/uikit'
import { FC } from 'react'
import styled from 'styled-components'
import SideBar from './components/Sidebar'
import FireIcon from './icons/fire.ico'
import EarningHistoryDropdown from './components/DropdownMenu'
import { useEarningPointHistory } from './hooks/useEarningPointHistory'
import { useGetPermissions } from './hooks/useGetPermission'

const Page = styled("div")`
  background: transparent;
  padding: 55px 64px;
  width: 100%;
`
export const DashboardPageLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { data, isLoading } = useEarningPointHistory({ page: 1, limit: 8, type: 'ALL' })
  useGetPermissions()
  return (
    <>
      <Flex width="100%" height="100%">
        <SideBar />
        <Page>
          <Flex justifyContent="space-between" marginBottom="54px" style={{ gap: '32px' }} flexWrap="wrap">
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
                  <img alt="user avatar" src="/images/nfts/baller-lg.png" width="100%" style={{ objectFit: 'cover' }} />
                </Box>
                <Text color="#1FD26F">@annajons</Text>
              </Flex>
              <Flex alignItems="center" style={{ gap: '10px' }}>
                <Text color="#1FD26F" fontSize="24px" fontWeight={500}>
                  1250 Total Points
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
                    7 Streak
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
