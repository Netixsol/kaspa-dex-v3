import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

export const useLiquidityProvision = () => {
  const token = Cookies.get('token')
  const { data, isLoading, error, status } = useQuery({
    queryKey: ['rewards'],
    enabled: !!token,
    queryFn: async () =>
      fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/liquidity/rewards`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          return res?.data !== null ? res?.data : {}
        }),
  })

  return { data, isLoading, error, status }
}
