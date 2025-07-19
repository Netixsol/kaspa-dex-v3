import useSWR from 'swr'
import Cookies from 'js-cookie'

const token = Cookies.get('token')

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch reward points')
    return res.json()
  })

export const useRewardPoints = () => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_DASHBOARD_API}/rewards/get-points`,
    fetcher,
  )

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  }
}
