import { useSearchParams } from 'next/navigation'
import EarningHistoryTable from './components/Tables/EarningHistoryTable'
import { useEarningPointHistory } from './hooks/useEarningPointHistory'
import ScreenShortContainer from './components/CanvasContainer'

const EarningHistory = () => {
  const searchParams = useSearchParams()
  const page = searchParams.get('page')
  const { data } = useEarningPointHistory({ page: page ? parseInt(page) : 1, limit: 8, type: 'ALL' })
  return (
    <>
      {/* <Flex justifyContent="space-between" alignItems="center" marginBottom="32px">
        <Heading scale="xxl">Earning History</Heading>
        <IconButton borderRadius="100%" width="48px" height="48px" style={{ padding: '12px' }}>
          <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
        </IconButton>
      </Flex> */}
      <ScreenShortContainer title="Earning History">
        <EarningHistoryTable data={data} />
      </ScreenShortContainer>
    </>
  )
}

export default EarningHistory
