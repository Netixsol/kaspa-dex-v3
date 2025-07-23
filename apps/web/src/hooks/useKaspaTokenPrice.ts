import { Currency, CurrencyAmount, Token, ChainId } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { gql } from 'graphql-request'
import { v3Clients } from 'utils/graphql'
import { kasplexTokens } from '@pancakeswap/tokens'

// GraphQL query to fetch token price from subgraph
const TOKEN_PRICE_QUERY = gql`
  query getTokenPrice($tokenAddress: String!) {
    token(id: $tokenAddress) {
      id
      derivedUSD
      totalValueLockedUSD
    }
  }
`

// GraphQL query to fetch pool price from subgraph
const POOL_PRICE_QUERY = gql`
  query getPoolPrice($token0Address: String!, $token1Address: String!) {
    pools(
      where: { 
        token0: $token0Address, 
        token1: $token1Address,
        totalValueLockedUSD_gt: "0"
      }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      first: 1
    ) {
      id
      token0Price
      token1Price
      totalValueLockedUSD
      token0 {
        id
        derivedUSD
      }
      token1 {
        id
        derivedUSD
      }
    }
  }
`

// Manual price fetching for Kaspa tokens
const fetchKaspaTokenPrice = async (token: Token, chainId: ChainId): Promise<string> => {
    if (chainId !== ChainId.KASPLEX_TESTNET) {
        throw new Error('Only supported for Kaspa chain')
    }

    const client = v3Clients[chainId]
    if (!client) {
        throw new Error('No subgraph client available')
    }

    try {
        // Try to get direct token price
        const tokenResult = await client.request(TOKEN_PRICE_QUERY, {
            tokenAddress: token.address.toLowerCase(),
        })

        if (tokenResult.token?.derivedUSD) {
            return tokenResult.token.derivedUSD
        }

        // If no direct price, try to get price through USDT pairs
        const usdtAddress = kasplexTokens.usdt.address.toLowerCase()
        const poolsResult = await client.request(POOL_PRICE_QUERY, {
            token0Address: token.address.toLowerCase(),
            token1Address: usdtAddress,
        })

        if (poolsResult.pools.length > 0) {
            const pool = poolsResult.pools[0]
            if (pool.token0.id === token.address.toLowerCase()) {
                // Token is token0, use token0Price
                return pool.token0Price
            }
            return pool.token1Price

        }

        // Fallback to hardcoded prices for known tokens
        const hardcodedPrices: Record<string, string> = {
            [kasplexTokens.usdt.address.toLowerCase()]: '1',
            [kasplexTokens.usdc.address.toLowerCase()]: '1',
            [kasplexTokens.kfc.address.toLowerCase()]: '0.1', // KFC price
            [kasplexTokens.blk.address.toLowerCase()]: '0.05', // BLK price
            [kasplexTokens.fnc.address.toLowerCase()]: '0.02', // FNC price
            [kasplexTokens.gem.address.toLowerCase()]: '0.01', // GEM price
            [kasplexTokens.stat.address.toLowerCase()]: '0.03', // STAT price
        }

        return hardcodedPrices[token.address.toLowerCase()] || '0'
    } catch (error) {
        console.error('Error fetching Kaspa token price:', error)
        return '0'
    }
}

export function useKaspaTokenPrice(
    currency?: Currency,
    options?: { enabled?: boolean },
): CurrencyAmount<Currency> | null {
    const { chainId } = useActiveChainId()
    const enabled = options?.enabled ?? true

    const { data: price } = useQuery({
        queryKey: ['kaspa-token-price', currency?.address, chainId],
        queryFn: () => {
            if (!currency || !(currency instanceof Token)) {
                return '0'
            }
            return fetchKaspaTokenPrice(currency, chainId)
        },
        enabled: enabled && chainId === ChainId.KASPLEX_TESTNET && currency instanceof Token,
        staleTime: 30000, // 30 seconds
        refetchInterval: 30000,
    })

    return useMemo(() => {
        if (!currency || !price || price === '0') {
            return null
        }

        try {
            const priceBN = CurrencyAmount.fromRawAmount(
                currency,
                Math.floor(parseFloat(price) * Math.pow(10, currency.decimals))
            )
            return priceBN
        } catch (error) {
            console.error('Error creating price amount:', error)
            return null
        }
    }, [currency, price])
} 