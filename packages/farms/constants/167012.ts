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
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'TZEAL-WKAS LP',
    lpAddress: '0xd2f622db6b6d67EFac968758905a0649dBA4ce3D',
    token: kasplexTokens.tzeal,
    quoteToken: kasplexTokens.wkas,
  },
  {
    pid: 1,
    v1pid: 1,
    lpSymbol: 'TKANGO-WKAS LP',
    lpAddress: '0xD9737e464Df3625e08a7F3Df61aABFBf523DBCfC',
    token: kasplexTokens.tkango,
    quoteToken: kasplexTokens.wkas,
  },
  {
    pid: 2,
    v1pid: 2,
    lpSymbol: 'WKAS-TNACHO LP',
    lpAddress: '0xC4278FE8b7009a7DCc445024Cb864f26c1F81073',
    token: kasplexTokens.wkas,
    quoteToken: kasplexTokens.tnacho,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
