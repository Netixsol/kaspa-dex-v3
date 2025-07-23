import { useSearchParams } from 'next/navigation'
import EarningHistoryTable from './components/Tables/EarningHistoryTable'
import { useEarningPointHistory } from './hooks/useEarningPointHistory'
import ScreenShortContainer from './components/CanvasContainer'
import { EarningHistoryTableSkeleton } from './components/Skeleton/TableSkeleton'
import { Flex, Text, Box } from '@pancakeswap/uikit'

const EarningHistory = () => {
  const searchParams = useSearchParams()
  const page = searchParams.get('page')
  const { data, isLoading } = useEarningPointHistory({ page: page ? parseInt(page) : 1, limit: 8, type: 'ALL' })
  if (isLoading) {
    return <EarningHistoryTableSkeleton />
  }
  return (
    <>
      {/* <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
        <Heading scale="xxl">Earning History</Heading>
        <IconButton borderRadius="100%" width="48px" height="48px" style={{ padding: '12px' }}>
          <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
        </IconButton>
      </Flex> */}
      <ScreenShortContainer title="Earning History">
        <Box marginTop="32px">
          <EarningHistoryTable data={data} />
          {data?.historyList.length <= 0 && !isLoading && (
            <Flex width="100%" justifyContent="center" marginTop="30px">
              <Text fontSize="24px">No Data Available in Table</Text>
            </Flex>
          )}
        </Box>
      </ScreenShortContainer>
    </>
  )
}

export default EarningHistory
