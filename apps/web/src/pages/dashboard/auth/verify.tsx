import { Box, CircleLoader, ModalV2, useToast } from '@pancakeswap/uikit'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardPageLayout } from 'views/Dashboard'

const AuthVerifyPage = () => {
  const [isOpen, setIsOpen] = useState(true)
  const token = Cookies.get('token')
  const searchParams = useSearchParams()
  const oauthToken = searchParams.get('oauth_token')
  const oauthVerifier = searchParams.get('oauth_verifier')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { toastSuccess, toastError } = useToast()

  const { mutate, data, isSuccess } = useMutation<any, Error, { authToken: string; authVerifier: string }>({
    mutationFn: async ({ authToken, authVerifier }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/auth/twitter/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oAuthToken: authToken,
          oAuthVerifier: authVerifier,
        }),
      })

      if (!response.ok) {
        throw new Error('Verification failed')
      }

      return response.json()
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        setIsOpen(false)
        setIsLoading(false)
        if (res?.data?.isUserTwitterLoggedIn) {
          Cookies.set('isTwitterLogin ', res?.data?.isUserTwitterLoggedIn)
        }
        toastSuccess(res?.message)
        router.push('/dashboard/socialmedia-amplification')
      }
    },
    onError: (error) => {
      setIsOpen(false)
      setIsLoading(false)
      toastError('Unable to login, try again!')
      router.push('/dashboard')
    },
  })

  useEffect(() => {
    if (oauthToken && oauthVerifier) {
      mutate({ authToken: oauthToken, authVerifier: oauthVerifier })
    }
  }, [oauthToken, oauthVerifier, mutate])
  return (
    <>
      <ModalV2 isOpen={isOpen}>
        {isLoading && (
          <Box zIndex={1000} width="100%" maxWidth="200px">
            <CircleLoader size="100" />
          </Box>
        )}
      </ModalV2>
    </>
  )
}

AuthVerifyPage.Layout = DashboardPageLayout

export default AuthVerifyPage
