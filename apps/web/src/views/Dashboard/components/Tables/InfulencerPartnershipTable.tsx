// import styled from 'styled-components'

import { Box, Flex, ProfileAvatar, Text } from '@pancakeswap/uikit'
import DynamicTable from './Table'

const InfulencerPartnershipTable = () => {
  const data = [
    {
      influencer: 'Completed Profile',
      platform: 'Twitter/X ',
      followers: '32000',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      influencer: 'Completed Profile',
      platform: 'Twitter/X ',
      followers: '32000',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      influencer: 'Completed Profile',
      platform: 'Twitter/X ',
      followers: '32000',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      influencer: 'Completed Profile',
      platform: 'Twitter/X ',
      followers: '32000',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
  ]

  const columns = [
    {
      key: 'influencer',
      header: 'Influencer ',
      render: (item) => (
        <Flex style={{ gap: '10px' }} alignItems="center" position="relative">
          {item?.user?.url ? (
            <ProfileAvatar
              width={42}
              height={42}
              style={{
                border: 'none',
                flexShrink: 0,
                borderRadius: '100%',
              }}
              placeholder="T"
              src="/images/nfts/baller-lg.png"
            />
          ) : (
            <Box width={42} height={42} borderRadius="100%" background="#252136">
              <Flex justifyContent="center" alignItems="center" width="100%" height="100%">
                <Text color="#1FD26F">{item?.user?.name?.charAt(0)}</Text>
              </Flex>
            </Box>
          )}
          <Text> {`@${item?.user?.name}`}</Text>
        </Flex>
      ),
      headerStyle: { paddingInline: '15px', background: '#120F1F' },
      cellStyle: { paddingInline: '15px', background: '#120F1F' },
    },
    {
      key: 'platform',
      header: 'Platforms',
      render: (item) => (
        <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
          <Text fontSize="14px">{item.platform}</Text>
        </Flex>
      ),
      headerStyle: { paddingInline: '15px', background: '#120F1F' },
      cellStyle: { paddingInline: '15px', background: '#120F1F' },
    },
    {
      key: 'followers',
      header: 'Followers',
      render: (item) => (
        <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
          <Text color="#1FCD6D">{item.followers}</Text>
        </Flex>
      ),
      headerStyle: { paddingInline: '15px', background: '#120F1F' },
      cellStyle: { paddingInline: '15px', background: '#120F1F' },
    },
  ]

  return <DynamicTable data={data} columns={columns} itemsPerPage={8} sepratorColor="#252136" />
}

export default InfulencerPartnershipTable
