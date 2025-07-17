// import { kasplexTokens } from '@pancakeswap/tokens'
// import { SerializedFarmConfig } from '../src'

// const farmsV3: SerializedFarmConfig[] = [
// {
//   pid: 1,
//   lpSymbol: 'USDT-BLK LP',
//   lpAddress: '0xce11ce746c9ddf6946a57fcd52add7c6337a6bf9',
//   token: kasplexTokens.usdt,
//   quoteToken: kasplexTokens.blk,
// },
// {
//   pid: 2,
//   lpSymbol: 'USDT-BLK LP',
//   lpAddress: '0xecff9aabd043e49c450a73808c7a16aa96e2000f',
//   token: kasplexTokens.usdt,
//   quoteToken: kasplexTokens.blk,
// },
// ]

// export default farmsV3

import { kasplexTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { getAddress } from 'viem'
import { SerializedFarmConfig } from '..'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0xce11ce746c9ddf6946a57fcd52add7c6337a6bf9',
    token0: kasplexTokens.blk,
    token1: kasplexTokens.usdt,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 2,
    lpAddress: '0xecc577a8657bc4771c5232fb9824b88e3f98eae3',
    token0: kasplexTokens.blk,
    token1: kasplexTokens.usdt,
    feeAmount: FeeAmount.HIGH,
  },
  {
    pid: 3,
    lpAddress: '0xea7dd193e6484dc1b574a0386d66b845cd319bf7',
    token0: kasplexTokens.blk,
    token1: kasplexTokens.kfc,
    feeAmount: FeeAmount.HIGH,
  },
])

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'USDT-BLK LP',
    lpAddress: '0xce11ce746c9ddf6946a57fcd52add7c6337a6bf9',
    token: kasplexTokens.blk,
    quoteToken: kasplexTokens.usdt,
  },
  {
    pid: 2,
    lpSymbol: 'BLK-USDT LP',
    lpAddress: '0xecc577a8657bc4771c5232fb9824b88e3f98eae3',
    token: kasplexTokens.blk,
    quoteToken: kasplexTokens.usdt,
  },
  {
    pid: 3,
    lpSymbol: 'BLK-KFC LP',
    lpAddress: '0xea7dd193e6484dc1b574a0386d66b845cd319bf7',
    token: kasplexTokens.blk,
    quoteToken: kasplexTokens.kfc,
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: getAddress(p.lpAddress),
}))

export default farms
