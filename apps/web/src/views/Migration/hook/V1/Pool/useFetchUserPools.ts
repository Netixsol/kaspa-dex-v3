import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { SerializedPool } from 'state/types'
import { useWalletClient } from 'wagmi'
import { transformPool } from 'state/pools/helpers'
import { getCakeContract } from 'utils/contractHelpers'
import { PoolCategory } from 'config/constants/types'
import { bscTokens, kasplexTokens } from '@pancakeswap/tokens'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { fetchUserPendingRewards, fetchUserStakeBalances } from './fetchPoolsUser'
// import { fetchUserStakeBalances, fetchUserPendingRewards } from './fetchPoolsUser'

export interface PoolsState {
  data: SerializedPool
  userDataLoaded: boolean
}

const cakeContract = getCakeContract()

const initialData = {
  [ChainId.BSC]: {
    data: {
      sousId: 0,
      stakingToken: bscTokens.cake.serialize,
      earningToken: bscTokens.cake.serialize,
      contractAddress: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
      poolCategory: PoolCategory.CORE,
      tokenPerBlock: '10',
      isFinished: false,
      totalStaked: '0',
    },
    userDataLoaded: false,
  },
  [ChainId.BSC_TESTNET]: {
    data: {
      sousId: 0,
      stakingToken: bscTokens.cake.serialize,
      earningToken: bscTokens.cake.serialize,
      contractAddress: '0x1d32c2945C8FDCBc7156c553B7cEa4325a17f4f9',
      poolCategory: PoolCategory.CORE,
      tokenPerBlock: '10',
      isFinished: false,
      totalStaked: '0',
    },
    userDataLoaded: false,
  },
  [ChainId.KASPLEX_TESTNET]: {
    data: {
      sousId: 0,
      stakingToken: kasplexTokens.tzeal,
      earningToken: kasplexTokens.wkas,
      contractAddress: '0xd2f622db6b6d67EFac968758905a0649dBA4ce3D',
      poolCategory: PoolCategory.CORE,
      tokenPerBlock: '10',
      isFinished: false,
      totalStaked: '0',
    },
    userDataLoaded: false,
  },
}

export const useFetchUserPools = (account) => {
  const { chainId } = useActiveChainId()
  const [userPoolsData, setPoolsUserData] = useState<PoolsState>(initialData[chainId || ChainId.KASPLEX_TESTNET])
  const { data: signer } = useWalletClient()
  const fetchUserPoolsData = useCallback(() => {
    if (account) {
      const fetchPoolsUserDataAsync = async () => {
        try {
          console.log('useFetchUserPools', account, chainId)
          console.log('cakeContract', cakeContract)
          const [stakedBalances, pendingRewards, totalStaking] = await Promise.all([
            fetchUserStakeBalances(account, signer),
            fetchUserPendingRewards(account, signer),
            cakeContract.read.balanceOf([account]),
          ])

          const userData = {
            sousId: initialData[chainId].data.sousId,
            allowance: '0',
            stakingTokenBalance: '0',
            stakedBalance: stakedBalances,
            pendingReward: pendingRewards,
          }

          setPoolsUserData((old) => ({
            data: {
              ...old.data,
              userData,
              totalStaked: new BigNumber(totalStaking.toString()).toJSON(),
            },
            userDataLoaded: true,
          }))
        } catch (error) {
          console.error('[Pools Action] Error fetching pool user data', error)
        }
      }

      fetchPoolsUserDataAsync()
    }
  }, [account, chainId])
  console.log('useFetchUserPools', userPoolsData)
  useFastRefreshEffect(() => {
    fetchUserPoolsData()
  }, [fetchUserPoolsData])

  return {
    data: transformPool(userPoolsData.data),
    userDataLoaded: userPoolsData.userDataLoaded,
    fetchUserPoolsData,
  }
}
