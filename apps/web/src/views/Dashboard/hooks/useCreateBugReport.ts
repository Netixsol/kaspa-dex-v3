import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'


export const useCreateBugReport = () => {
const token = Cookies.get('token')
  const mutation = useMutation({
    mutationFn: async ({ text, file }: { text: string; file: File | string }) => {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('bugSnapshot', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/bug-report/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create bug report')
      }

      return response.json()
    },
  })

  return mutation
}
