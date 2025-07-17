import { ChainId, Token, WETH9 } from '@pancakeswap/sdk'
import { ethereumTokens, bscTokens, bscTestnetTokens, goerliTestnetTokens, kasplexTokens } from '@pancakeswap/tokens'

export const usdGasTokensByChain: { [chainId in ChainId]?: Token[] } = {
  [ChainId.ETHEREUM]: [ethereumTokens.usdt],
  [ChainId.GOERLI]: [goerliTestnetTokens.usdc],
  [ChainId.BSC]: [bscTokens.busd],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.busd],
  [ChainId.KASPLEX_TESTNET]: [kasplexTokens.usdt],
}

export const nativeWrappedTokenByChain: { [chainId in ChainId]?: Token } = {
  [ChainId.ETHEREUM]: ethereumTokens.weth,
  [ChainId.GOERLI]: goerliTestnetTokens.weth,
  [ChainId.BSC]: bscTokens.wbnb,
  [ChainId.BSC_TESTNET]: bscTestnetTokens.wbnb,
  [ChainId.KASPLEX_TESTNET]: WETH9[ChainId.KASPLEX_TESTNET], // Assuming WETH is used on Kasplex testnet
}

export * from './v2'
export * from './v3'
export * from './stableSwap'
