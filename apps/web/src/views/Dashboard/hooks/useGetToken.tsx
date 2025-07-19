import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

export const useGetToken = () => {
  const { data, isLoading, error, status } = useQuery({
    queryKey: ['token'],

    queryFn: async () =>
      fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/get-token`)
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          if (res?.token) {
            Cookies.set('token', res?.token)
          }
          return res !== null ? res : {}
        }),
  })

  return { data, isLoading, error, status }
}
