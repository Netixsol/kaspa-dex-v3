import { NotFound } from '@pancakeswap/uikit'
import { DashboardPageLayout } from 'views/Dashboard'

const UnAuthorizationPage = () => {
  return <NotFound statusCode={403} />
}

UnAuthorizationPage.Layout = DashboardPageLayout

export default UnAuthorizationPage
