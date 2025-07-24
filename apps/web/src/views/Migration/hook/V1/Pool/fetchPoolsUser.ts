import BigNumber from 'bignumber.js'
import { getMasterchefV1Contract } from 'utils/contractHelpers'

export const fetchUserStakeBalances = async (account, signer?: any) => {
  // Cake / Cake pool
  console.log('fetchUserStakeBalances', account)
  const MasterChef = await getMasterchefV1Contract(signer)
  if (!MasterChef) {
    console.log('MasterChef in If', MasterChef)
    throw new Error('MasterChef contract not found')
  }
  console.log('MasterChef', MasterChef)
  const masterPoolAmount = await MasterChef.read.userInfo(['0', account])
  console.log('masterPoolAmount', masterPoolAmount)
  return new BigNumber(masterPoolAmount.toString()).toJSON()
}

export const fetchUserPendingRewards = async (account, signer?: any) => {
  // Cake / Cake pool
  console.log('fetchUserPendingRewards Before')
  const pendingReward = await getMasterchefV1Contract(signer).read.pendingSushi([0n, account])
  console.log('fetchUserPendingRewards', account, pendingReward)
  return new BigNumber(pendingReward.toString()).toJSON()
}
