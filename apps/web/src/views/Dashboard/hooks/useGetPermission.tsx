import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

export const useGetPermissions = () => {
  const token = Cookies.get('token')
  useQuery({
    queryKey: ['get-permissions'],

    queryFn: async () =>
      fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/user/permission`, {
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
          Cookies.set('permissions', JSON.stringify(res?.data))
          //   return res !== null ? res : {}
        }),
  })

  //   return { data, isLoading, error, status }
}
