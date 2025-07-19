import { shouldGeoBlock } from '@pancakeswap/utils/geoBlock'
import { NextRequest, NextResponse } from 'next/server'
import { routePermissions } from 'views/Dashboard/types/enums'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname
  const privateRoutes = [
    '/dashboard/socialmedia-amplification',
    '/dashboard/liquidity-provision',
    '/dashboard/trading-swap',
    '/dashboard/farming-staking',
    '/dashboard/migrate-lps',
    '/dashboard/milestone-rewards',
    '/dashboard/realtime-update',
    '/dashboard/multipliers-bounses',
    '/dashboard/pre-launch',
    '/dashboard/launch-week',
    '/dashboard/ongoing-engagments',
    '/dashboard/earning-history',
    '/dashboard/report-bug',
    '/dashboard/daily-spin',
  ]
  const publicRoutes = ['/dashboard']

  // Safely get cookie values
  const token = req.cookies.get('token')?.value
  const isTwitterLogin = req.cookies.get('isTwitterLogin')?.value === 'true'
  let permissions = {}

  try {
    const permissionsCookie = req.cookies.get('permissions')?.value
    permissions = permissionsCookie ? JSON.parse(permissionsCookie) : {}
  } catch (error) {
    permissions = {}
  }

  const isPublicRoute = publicRoutes.includes(path) || !privateRoutes.includes(path)
  const isPrivateRoute = privateRoutes.includes(path)

  if (isPublicRoute && isTwitterLogin && token) {
    return NextResponse.redirect(new URL('/dashboard/socialmedia-amplification', req.url))
  }

  if (isPrivateRoute && !isTwitterLogin) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  const currentRoutePermission = routePermissions?.[path]

  if (
    currentRoutePermission &&
    !permissions[currentRoutePermission] &&
    !isPublicRoute &&
    path !== '/dashboard/socialmedia-amplification'
  ) {
    return NextResponse.redirect(new URL('/dashboard/403', req.url))
  }

  if (req.nextUrl.pathname.startsWith('/api/proxy/')) {
    return res
  }

  if (shouldGeoBlock(req.geo)) {
    return NextResponse.redirect(new URL('/451', req.url))
  }
  return res
}
export const config = {
  matcher: [
    '/',
    '/swap',
    '/liquidity',
    '/farms',
    '/add',
    '/remove',
    '/find',
    '/info/:path*',
    '/dashboard',
    '/dashboard/socialmedia-amplification',
    '/dashboard/liquidity-provision',
    '/dashboard/trading-swap',
    '/dashboard/farming-staking',
    '/dashboard/migrate-lps',
    '/dashboard/milestone-rewards',
    '/dashboard/realtime-update',
    '/dashboard/multipliers-bounses',
    '/dashboard/pre-launch',
    '/dashboard/launch-week',
    '/dashboard/ongoing-engagments',
    '/dashboard/earning-history',
    '/dashboard/report-bug',
    '/dashboard/daily-spin',
    // '/farms',
    // '/stake',
    // '/ifo',
    // '/prediction',
    // '/find',
    // '/limit-orders',
    // '/lottery',
    // '/nfts',
    // '/info/:path*',
  ],
}
