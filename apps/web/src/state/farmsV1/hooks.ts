import { useSelector } from 'react-redux'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { useAppDispatch } from 'state'
import { deserializeToken } from '@pancakeswap/token-lists'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { DeserializedFarm, DeserializedFarmsState, DeserializedFarmUserData, SerializedFarm } from '@pancakeswap/farms'
import { State } from '../types'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync } from '.'

const deserializeFarmUserData = (farm: SerializedFarm): DeserializedFarmUserData => {
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

const deserializeFarm = (farm: SerializedFarm): DeserializedFarm => {
  const { lpAddress, lpSymbol, v1pid, dual, multiplier, isCommunity, quoteTokenPriceBusd, tokenPriceBusd } = farm

  return {
    lpAddress,
    lpSymbol,
    pid: v1pid,
    dual,
    multiplier,
    isCommunity,
    quoteTokenPriceBusd,
    tokenPriceBusd,
    token: deserializeToken(farm.token),
    quoteToken: deserializeToken(farm.quoteToken),
    userData: deserializeFarmUserData(farm),
    tokenAmountTotal: farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO,
    lpTotalInQuoteToken: farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO,
    lpTotalSupply: farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO,
    tokenPriceVsQuote: farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO,
    poolWeight: farm.poolWeight ? new BigNumber(farm.poolWeight) : BIG_ZERO,
  }
}

export const usePollFarmsV1WithUserData = () => {
  const dispatch = useAppDispatch()
  const { address: account } = useAccount()

  useSlowRefreshEffect(() => {
    getFarmConfig(ChainId.KASPLEX_TESTNET).then((farmsConfig) => {
      const pids = farmsConfig.filter((farmToFetch) => farmToFetch.v1pid).map((farmToFetch) => farmToFetch.v1pid)

      dispatch(fetchFarmsPublicDataAsync(pids))

      if (account) {
        dispatch(fetchFarmUserDataAsync({ account, pids }))
      }
    })
  }, [dispatch, account])
}

// code added for v2/migration.tsx
export const useFarmsV1 = (): DeserializedFarmsState => {
  const farms = useSelector((state: State) => state.farmsV1)
  const deserializedFarmsData = farms.data.map(deserializeFarm)
  const { loadArchivedFarmsData, userDataLoaded, poolLength } = farms
  return {
    loadArchivedFarmsData,
    userDataLoaded,
    data: deserializedFarmsData,
    poolLength,
    regularCakePerBlock: 0.001,
    totalRegularAllocPoint: '100',
    // regularCakePerBlock: farms.regularCakePerBlock
    //   ? new BigNumber(farms.regularCakePerBlock)
    //   : BIG_ZERO,
  }
}

/**
 * @deprecated use the BUSD hook in /hooks
 */
export const usePriceCakeBusd = (): BigNumber => {
  const price = useCakeBusdPrice()
  return useMemo(() => (price ? new BigNumber(price.toSignificant(6)) : BIG_ZERO), [price])
}
