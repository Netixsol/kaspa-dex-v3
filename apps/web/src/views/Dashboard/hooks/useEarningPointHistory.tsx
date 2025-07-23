import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

interface PointHistoryParams {
  page?: number
  limit?: number
  type?: string
  // Add other possible query parameters
}

export const useEarningPointHistory = (params: PointHistoryParams = {}) => {
  const token = Cookies.get('token')
  const { data, isLoading, error, status } = useQuery({
    queryKey: ['points-history', params],
    enabled: !!token,
    queryFn: async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/points/history`)

        if (params.page) url.searchParams.append('page', params.page.toString())
        if (params.limit) url.searchParams.append('limit', params.limit.toString())
        if (params.type) url.searchParams.append('type', params.type)
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const res = await response.json()
        return res?.data || {}
      } catch (error) {
        console.error('Failed to fetch Twitter rewards:', error)
        return {}
      }
    },
  })

  return { data, isLoading, error, status }
}
