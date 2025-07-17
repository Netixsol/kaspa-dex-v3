import { useQuery } from '@tanstack/react-query'

export const useFarmingStaking = () => {
  const { data, isLoading, error, status } = useQuery({
    queryKey: ['farming'],

    queryFn: async () =>
      fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/stakes/rewards`)
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          return res?.data !== null ? res?.data : {}
        }),
  })

  return { data, isLoading, error, status }
}
