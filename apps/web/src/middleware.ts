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
  ]
  const publicRoutes = ['/dashboard']

  // Safely get cookie values
  const token = req.cookies.get('token')?.value
  const isTwitterLogin = req.cookies.get('isTwitterLogin')?.value === 'true' // Convert to boolean
  let permissions = {}

  try {
    const permissionsCookie = req.cookies.get('permissions')?.value
    permissions = permissionsCookie ? JSON.parse(permissionsCookie) : {}
  } catch (error) {
    console.error('Failed to parse permissions cookie:', error)
    permissions = {}
  }

  const isPublicRoute = publicRoutes.includes(path) || !privateRoutes.includes(path)
  const isPrivateRoute = privateRoutes.includes(path)

  // Authentication checks
  if (isPublicRoute && isTwitterLogin && token) {
    return NextResponse.redirect(new URL('/dashboard/socialmedia-amplification', req.url))
  }

  if (isPrivateRoute && !isTwitterLogin && !token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Authorization check with proper safety checks
  const currentRoutePermission = routePermissions?.[path] // Make sure routePermissions is defined

  if (
    currentRoutePermission && // Check if permission is required for this route
    !permissions[currentRoutePermission] && // Check if user has the permission
    !isPublicRoute &&
    path !== '/dashboard/socialmedia-amplification'
  ) {
    return NextResponse.redirect(new URL('/403', req.url))
  }
  // Skip geo-blocking for API proxy routes
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
