import { DashboardPageLayout } from 'views/Dashboard'
import FarmingStaking from 'views/Dashboard/farmingStaking'

const DashboardPage = () => {
  return (
    <>
      <FarmingStaking />
    </>
  )
}

DashboardPage.Layout = DashboardPageLayout

export default DashboardPage
