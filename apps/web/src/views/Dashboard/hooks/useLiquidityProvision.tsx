import { useQuery } from '@tanstack/react-query'

export const useLiquidityProvision = () => {
  const { data, isLoading, error, status } = useQuery({
    queryKey: ['rewards'],

    queryFn: async () =>
      fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/liquidity/rewards`)
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          return res?.data !== null ? res?.data : {}
        }),
  })

  return { data, isLoading, error, status }
}
