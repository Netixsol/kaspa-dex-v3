// import styled from 'styled-components'

import { Flex, Text } from '@pancakeswap/uikit'
import TickIcon from 'views/Dashboard/icons/tick.ico'
import DynamicTable from './Table'

const EarningHistoryTable = () => {
  const data = [
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
    {
      activity: 'Completed Profile',
      points: '50 points',
      date: '2023-05-15 14:30',
      user: { name: 'John', avatar: 'url-to-avatar' },
    },
  ]

  const columns = [
    {
      key: 'activity',
      header: 'Activity',
      render: (item) => (
        <Flex alignItems="center" height="100%">
          <Text>{item.activity}</Text>
        </Flex>
      ),
    },
    {
      key: 'points',
      header: 'Earn Points',
      render: (item) => (
        <Flex alignItems="center" height="100%">
          <Text>{item.points}</Text>
        </Flex>
      ),
      cellStyle: { color: '#1FCD6D' },
    },
    {
      key: 'date',
      header: 'Date/Time',
      render: (item) => (
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Text>{item.date}</Text>
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
      ),
    },
  ]

  return <DynamicTable data={data} columns={columns} itemsPerPage={8} />
}

export default EarningHistoryTable
