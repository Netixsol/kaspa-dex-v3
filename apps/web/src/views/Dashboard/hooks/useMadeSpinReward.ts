import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'

export const useMadeSpinReward = () => {
const token = Cookies.get('token')
  
  const mutation = useMutation({
    mutationFn: async ({
      points,
    }: {
      points: string
    }) => {

      const response = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/spin/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points }),
      })

      if (!response.ok) {
        throw new Error('Failed to made spin')
      }

      return response.json()
    },
  })

  return mutation
}
