import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

export const useLiquidityProvision = () => {
  const token = Cookies.get('token')
  const { data, isLoading, error, status } = useQuery({
    queryKey: ['rewards'],
    enabled: !!token,
    queryFn: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/liquidity/rewards`, {
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
