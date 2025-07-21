import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

export const useLeaderBoard = (params: any = {}) => {
  const token = Cookies.get('token')
  const { data, isLoading, error, status } = useQuery({
    queryKey: ['leader-board', params],
    enabled: !!token,
    queryFn: async () => {
      const url = new URL(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/leaderboeard/users`)

      // Type-safe parameter handling
      if (params.page) url.searchParams.append('page', params.page.toString())
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.type) url.searchParams.append('type', params.type)

      return fetch(url, {
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
        })
    },
  })

  return { data, isLoading, error, status }
}
