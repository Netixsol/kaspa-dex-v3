import useSWR from 'swr'

import { WETH9 } from '@pancakeswap/sdk'

import { COINGECKO_API_URL, NETWORKS_INFO } from 'views/Swap/TokenInfo/constant'
import useActiveWeb3React from './useActiveWeb3React'

export interface TokenInfo {
  price: number
  marketCap: number
  marketCapRank: number
  circulatingSupply: number
  totalSupply: number
  allTimeHigh: number
  allTimeLow: number
  tradingVolume: number
  description: { en: string }
  name: string
}

export default function useTokenInfo(token: any | undefined): { data: TokenInfo; loading: boolean; error: any } {
  // @ts-ignore
  const { chainId, isArbitrium } = useActiveWeb3React()
  // eslint-disable-next-line prefer-promise-reject-errors
  const fetcher = (url: string) => (url ? fetch(url).then((r) => r.json()) : Promise.reject({ data: {}, error: '' }))
  const tokenAddress = isArbitrium ? token?.wrapped?.address?.toLowerCase() || '' : (token?.address || '').toLowerCase()
  let url = ''
  if (tokenAddress.toLowerCase() === WETH9[chainId].address.toLowerCase()) {
    url = `${COINGECKO_API_URL}/coins/${NETWORKS_INFO[chainId].coingeckoNativeTokenId}`
  } else if (tokenAddress) {
    url = `${COINGECKO_API_URL}/coins/${NETWORKS_INFO[chainId].coingeckoNetworkId}/contract/${tokenAddress}`
  }
  const { data, error } = useSWR(url, fetcher, {
    refreshInterval: 60000,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.status === 404) return
      if (retryCount >= 10) return
      if (error.status === 403) {
        // If API return 403, retry after 30 seconds.
        setTimeout(() => revalidate({ retryCount }), 30000)
        return
      }
      setTimeout(() => revalidate({ retryCount }), 20000)
    },
  })

  // if (error && import.meta.env.DEV) {
  //   console.error(error)
  // }

  const loading = !data

  const result = {
    price: data?.market_data?.current_price?.usd || 0,
    marketCap: data?.market_data?.market_cap?.usd || 0,
    marketCapRank: data?.market_data?.market_cap_rank || 0,
    circulatingSupply: data?.market_data?.circulating_supply || 0,
    totalSupply: data?.market_data?.total_supply || 0,
    allTimeHigh: data?.market_data?.ath?.usd || 0,
    allTimeLow: data?.market_data?.atl?.usd || 0,
    tradingVolume: data?.market_data?.total_volume?.usd || 0,
    description: data?.description || { en: '' },
    name: data?.name || '',
  }

  return { data: result, loading, error }
}
