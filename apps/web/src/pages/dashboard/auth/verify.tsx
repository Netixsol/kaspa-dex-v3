import { useTranslation } from '@pancakeswap/localization'
import { WalletModalV2 } from '@pancakeswap/ui-wallets'
import { Box, CircleLoader, ModalV2, useToast } from '@pancakeswap/uikit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createWallets, getDocLink } from 'config/wallet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import Cookies from 'js-cookie'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { DashboardPageLayout } from 'views/Dashboard'
import { Address, useAccount, useConnect, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { SignMessageResult } from 'wagmi/dist/actions'

const AuthVerifyPage = () => {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(true)
  const searchParams = useSearchParams()
  const oauthToken = searchParams.get('oauth_token')
  const oauthVerifier = searchParams.get('oauth_verifier')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toastError } = useToast()
  const { address } = useAccount()
  const { login } = useAuth()
  const { connectAsync, connectors } = useConnect()
  const { chainId } = useActiveChainId()
  const { signMessageAsync } = useSignMessage()
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()
  const docLink = useMemo(() => getDocLink(code), [code])
  const wallets = useMemo(() => createWallets(chainId, connectAsync), [chainId, connectAsync])
  const generateVerificationMessage = (walletAddress: string, nonce: string) => {
    return new SiweMessage({
      domain: window.location.host,
      address: walletAddress,
      statement: 'Sign in to Kaspa Dashboard',
      uri: window.location.origin,
      version: '1',
      chainId: chainId,
      nonce,
    }).prepareMessage()
  }
  const handleSignatureRequest = async () => {
    if (!address) return
    try {
      setIsLoading(true)
      // 1. Get nonce from backend
      const nonceRes = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/genrate-nonce`)
      const { nonce } = await nonceRes.json()
      // 2. Generate and sign SIWE message
      const message = generateVerificationMessage(address, nonce)
      const signature = await signMessageAsync({ message })
      // 3. Submit signature to backend
      return storeSignature({ signature, walletAddress: address })
    } catch (error) {
      toastError(t('Wallet verification failed'))
      console.error('Signature error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const { mutate: verifyTwitter, isLoading: isVerifyingTwitter } = useMutation({
    mutationFn: async ({
      authToken,
      authVerifier,
      walletAddress,
      signature,
      nonce,
    }: {
      authToken: string
      authVerifier: string
      walletAddress: string
      signature?: string
      nonce?: string
    }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/auth/twitter/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oAuthToken: authToken,
          oAuthVerifier: authVerifier,
          walletAddress: walletAddress,
          signature,
          nonce,
        }),
      })
      if (!response.ok) {
        throw new Error('Verification failed')
      }
      return response.json()
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        if (res.data?.signature === null) {
          // Signature is required - request one
          handleSignatureRequest()
        } else {
          // Proceed with normal success flow
          Cookies.set('isTwitterLogin', 'true', { secure: true, sameSite: 'strict' })
          Cookies.set('token', res.data.token, { secure: true, sameSite: 'strict' })
          queryClient.invalidateQueries(['get-permissions'])
          router.push('/dashboard/socialmedia-amplification')
          setIsOpen(false)
        }
      }
    },
    onError: (error) => {
      console.error('Verification error:', error)
      toastError(t('Unable to complete verification, please try again'))
      setIsOpen(false)
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })
  const { mutate: storeSignature } = useMutation({
    mutationFn: async ({ signature, walletAddress }: { signature: SignMessageResult; walletAddress: Address }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_API}/auth/signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress,
          signature,
        }),
      })
      if (!response.ok) {
        throw new Error('Verification failed')
      }
      return response.json()
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        // Proceed with normal success flow
        Cookies.set('isTwitterLogin', res?.data?.isUserTwitterLoggedIn, { secure: true, sameSite: 'strict' })
        Cookies.set('token', res.data.token, { secure: true, sameSite: 'strict' })
        queryClient.invalidateQueries(['get-permissions'])
        router.push('/dashboard/socialmedia-amplification')
        setIsOpen(false)
      }
      console.log(res, 'res')
    },
    onError: (error) => {
      console.log(error)
    },
    onSettled: () => {
      setIsLoading(false)
    },
  })
  useEffect(() => {
    if (oauthToken && oauthVerifier && address) {
      setIsLoading(true)
      // First attempt without signature
      verifyTwitter({
        authToken: oauthToken,
        authVerifier: oauthVerifier,
        walletAddress: address,
      })
    }
  }, [oauthToken, oauthVerifier, address, verifyTwitter])
  if (!address) {
    return (
      <WalletModalV2
        docText={t('Learn How to Connect')}
        docLink={docLink}
        isOpen={!address}
        wallets={wallets}
        login={login}
      />
    )
  }
  return (
    <>
      <ModalV2 isOpen={isOpen}>
        {isLoading && (
          <Box zIndex={1000} width="100%" maxWidth="200px">
            <CircleLoader size="100" />
            <p>{t('Verifying your credentials...')}</p>
          </Box>
        )}
      </ModalV2>
    </>
  )
}
AuthVerifyPage.Layout = DashboardPageLayout
export default AuthVerifyPage
