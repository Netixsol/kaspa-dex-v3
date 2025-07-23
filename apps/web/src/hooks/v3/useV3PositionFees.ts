import { Currency, CurrencyAmount, ChainId } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/v3-sdk'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { useSingleCallResult } from 'state/multicall/hooks'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { gql } from 'graphql-request'
import { v3Clients } from 'utils/graphql'

const MAX_UINT128 = 2n ** 128n - 1n

// GraphQL query to fetch position fees from subgraph
const POSITION_FEES_QUERY = gql`
  query getPositionFees($tokenId: String!) {
    position(id: $tokenId) {
      id
      pool {
        id
        token0 {
          id
          decimals
        }
        token1 {
          id
          decimals
        }
      }
      tokensOwed0
      tokensOwed1
    }
  }
`

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(
  pool?: Pool,
  tokenId?: bigint,
  asWETH = false,
): [CurrencyAmount<Currency>, CurrencyAmount<Currency>] | [undefined, undefined] {
  const positionManager = useV3NFTPositionManagerContract()
  const { chainId } = useActiveChainId()
  const owner = useSingleCallResult({
    contract: tokenId ? positionManager : null,
    functionName: 'ownerOf',
    args: [tokenId],
  }).result

  const latestBlockNumber = useCurrentBlock()

  // we can't use multicall for this because we need to simulate the call from a specific address
  // latestBlockNumber is included to ensure data stays up-to-date every block
  const [amounts, setAmounts] = useState<[bigint, bigint] | undefined>()

  useEffect(() => {
    if (positionManager && typeof tokenId !== 'undefined' && owner) {
      // Try contract simulation first
      positionManager.simulate
        .collect(
          [
            {
              tokenId,
              recipient: owner, // some tokens might fail if transferred to address(0)
              amount0Max: MAX_UINT128,
              amount1Max: MAX_UINT128,
            },
          ],
          { account: owner, value: 0n }, // need to simulate the call as the owner
        )
        .then((results) => {
          const [amount0, amount1] = results.result
          setAmounts([amount0, amount1])
        })
        .catch(async (error) => {
          console.warn('Contract simulation failed, trying subgraph fallback:', error)

          // Fallback to subgraph for Kaspa tokens or when contract simulation fails
          try {
            const client = v3Clients[chainId as ChainId]
            if (client && tokenId) {
              const result = await client.request(POSITION_FEES_QUERY, {
                tokenId: tokenId.toString(),
              })

              if (result.position) {
                const tokensOwed0 = BigInt(result.position.tokensOwed0 || '0')
                const tokensOwed1 = BigInt(result.position.tokensOwed1 || '0')
                setAmounts([tokensOwed0, tokensOwed1])
              } else {
                setAmounts([0n, 0n])
              }
            } else {
              setAmounts([0n, 0n])
            }
          } catch (subgraphError) {
            console.error('Subgraph fallback also failed:', subgraphError)
            setAmounts([0n, 0n])
          }
        })
    }
  }, [positionManager, owner, latestBlockNumber, tokenId, chainId])

  if (pool && amounts) {
    return [
      CurrencyAmount.fromRawAmount(asWETH ? pool.token0 : unwrappedToken(pool.token0), amounts[0].toString()),
      CurrencyAmount.fromRawAmount(asWETH ? pool.token1 : unwrappedToken(pool.token1), amounts[1].toString()),
    ]
  }
  return [undefined, undefined]
}
