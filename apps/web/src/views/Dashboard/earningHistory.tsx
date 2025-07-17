import { Heading } from '@pancakeswap/uikit'
import EarningHistoryTable from './components/Tables/EarningHistoryTable'

const EarningHistory = () => {
  return (
    <>
      <Heading scale="xxl" marginBottom="32px">
        Earning History
      </Heading>
      <EarningHistoryTable />
    </>
  )
}

export default EarningHistory
