// import styled from 'styled-components'

import { Flex, Text } from '@pancakeswap/uikit'
import TickIcon from 'views/Dashboard/icons/tick.ico'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import DynamicTable from './Table'

// interface PointHistoryItem {
//   reward_event: string
//   points_awarded: string // or number if you prefer
//   reward_date: string // or Date if you'll convert it
// }
const EarningHistoryTable = ({ data }: { data: any }) => {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()
  const handlePagination = (page) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (page) {
      params.set('page', page)
    } else {
      params.delete('page')
    }
    replace(`${pathname}?${params.toString()}`)
  }
  const columns = [
    {
      key: 'reward_event',
      header: 'Activity',
      render: (item) => (
        <Flex alignItems="center" height="100%">
          <Text>{item.reward_event}</Text>
        </Flex>
      ),
    },
    {
      key: 'points_awarded',
      header: 'Earn Points',
      render: (item) => (
        <Flex alignItems="center" height="100%">
          <Text>{item.points_awarded}</Text>
        </Flex>
      ),
      cellStyle: { color: '#1FCD6D' },
    },
    {
      key: 'reward_date',
      header: 'Date/Time',
      render: (item) => (
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Text>{item.reward_date}</Text>
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

  return (
    <DynamicTable
      data={data?.historyList}
      columns={columns}
      itemsPerPage={8}
      totalItems={data?.totalRecords}
      onPageChange={(page) => {
        handlePagination(page)
      }}
      serverSidePagination
    />
  )
}

export default EarningHistoryTable
