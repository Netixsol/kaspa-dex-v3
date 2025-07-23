import { DeserializedFarm, FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { useCakePriceAsBN } from '@pancakeswap/utils/useCakePrice'
import BigNumber from 'bignumber.js'
import { CAKE_PER_YEAR } from 'config'
import { useActiveChainId } from 'hooks/useActiveChainId'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFarms, usePollFarmsWithUserData } from 'state/farms/hooks'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { getFarmApr } from 'utils/apr'
import { useAccount, useContractReads, useContractRead } from 'wagmi'
import MigrationFarmTable from '../MigrationFarmTable'
import { V3Step1DesktopColumnSchema } from '../types'
import { STABLE_LP_TO_MIGRATE } from './Step2'
// import { readContract } from 'wagmi/dist/actions'
import { ZealousMasterChefV2 } from 'config/abi/ZealousMasterChefV2'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
// import { readContract } from '@wagmi/core' 

const OldFarmStep1: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: farmsLP, userDataLoaded } = useFarms()
  console.log("farmsLP:::",farmsLP)
  const {
    data: { farmsWithPrice },
  } = useFarmsV3Public()
  const cakePrice = useCakePriceAsBN()
  const { chainId } = useActiveChainId()

  usePollFarmsWithUserData()

  const userDataReady = !account || (!!account && userDataLoaded)

  const farms = farmsLP
    // .filter((farm) => farm.pid !== 0)
    .filter((farm) => {
      if (STABLE_LP_TO_MIGRATE.includes(farm.lpAddress)) return true
      return farmsWithPrice
        .filter((f) => f.multiplier !== '0X')
        .find(
          (farmV3) =>
            (farmV3.quoteToken.address === farm.quoteToken.address && farmV3.token.address === farm.token.address) ||
            (farmV3.quoteToken.address === farm.token.address && farmV3.token.address === farm.quoteToken.address),
        )
    })

  const stakedOrHasTokenBalance = farms.filter((farm) => {
    return (
      (farm.userData &&
        (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
          new BigNumber(farm.userData.tokenBalance).isGreaterThan(0))) ||
      new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)
    )
  })

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
          chainId,
          new BigNumber(farm.poolWeight),
          cakePrice,
          totalLiquidity,
          farm.lpAddress,
          CAKE_PER_YEAR,
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [cakePrice, chainId],
  )

  const chosenFarmsMemoized = useMemo(() => {
    return userDataReady ? farmsList(stakedOrHasTokenBalance) : []
  }, [stakedOrHasTokenBalance, farmsList, userDataReady])

console.log("sortedRows",stakedOrHasTokenBalance)

//fetching pool length
const { data: poolLength } = useContractRead({
  address: '0x65b0552Be5c62d60EC4a3daCC72894c8F96C619a',
  abi: ZealousMasterChefV2,
  functionName: 'poolLength',
});

//making custom poolids
const poolIds = useMemo(() => {
  if (!poolLength) return [];
  return Array.from({ length: Number(poolLength) }, (_, i) => i);
}, [poolLength]);

//fetching pools
const { data: poolInfos } = useContractReads({
  contracts: poolIds.map((pid) => ({
    address: '0x65b0552Be5c62d60EC4a3daCC72894c8F96C619a',
    abi: ZealousMasterChefV2,
    functionName: 'poolInfo',
    args: [pid],
  })) as any[],
  enabled: poolIds.length > 0,
});

console.log("All pools from new contract:", poolInfos)
console.log("farmsLP2:::",farmsLP)
console.log("farms", farms)
  return (
    <MigrationFarmTable
      title={t('Old Farms')}
      noStakedFarmText={t('You are not currently staking in any farms that require migrations.')}
      account={account}
      columnSchema={V3Step1DesktopColumnSchema}
      farms={chosenFarmsMemoized}
      // farms={farms}

      userDataReady={true}
    />
  )
}

export default OldFarmStep1
