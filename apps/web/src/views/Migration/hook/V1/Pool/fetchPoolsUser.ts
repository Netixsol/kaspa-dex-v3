import BigNumber from 'bignumber.js'
import { getMasterchefV1Contract } from 'utils/contractHelpers'

export const fetchUserStakeBalances = async (account) => {
  // Cake / Cake pool
  const masterPoolAmount = await getMasterchefV1Contract().read.userInfo(['0', account])
  return new BigNumber(masterPoolAmount[0].toString()).toJSON()
}

export const fetchUserPendingRewards = async (account) => {
  // Cake / Cake pool
  const pendingReward = await getMasterchefV1Contract().read.pendingCake(['0', account])
  return new BigNumber(pendingReward.toString()).toJSON()
}
