import { DashboardPageLayout } from 'views/Dashboard'
import LoginModal from 'views/Dashboard/components/LoginModal'

const DashboardPage = () => {
  return (
    <>
      <LoginModal />
    </>
  )
}

DashboardPage.Layout = DashboardPageLayout

export default DashboardPage
