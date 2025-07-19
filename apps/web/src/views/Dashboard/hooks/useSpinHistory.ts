import useSWR from 'swr'

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch spin history')
    return res.json()
  })

export const useSpinHistory = (page = 1, limit = 7) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_DASHBOARD_API}/spin/history?page=${page}&limit=${limit}`,
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
