import { BLOCKS_CLIENT, BLOCKS_CLIENT_ETH, INFO_CLIENT, INFO_CLIENT_ETH } from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoStableSwapClient } from 'utils/graphql'
import { GraphQLClient } from 'graphql-request'

import { ChainId } from '@pancakeswap/sdk'
import {
  ETH_TOKEN_BLACKLIST,
  PCS_ETH_START,
  PCS_V2_START,
  TOKEN_BLACKLIST,
  BSC_TOKEN_WHITELIST,
  ETH_TOKEN_WHITELIST,
} from 'config/constants/info'

export type MultiChainName = 'BSC' | 'ETH' | 'BSC_TESTNET'

export type MultiChainNameExtend = MultiChainName | 'BSC_TESTNET' | 'KASPLEX_TESTNET' | 'KASPLEX_MAINNET'

export const multiChainName: Record<number | string, MultiChainNameExtend> = {
  [ChainId.BSC]: 'BSC',
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.BSC_TESTNET]: 'BSC_TESTNET',
  [ChainId.KASPLEX_TESTNET]: 'KASPLEX_TESTNET',
}

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  ETH: 'ETH',
}

export const multiChainBlocksClient = {
  BSC: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
  BSC_TESTNET: 'https://api.thegraph.com/subgraphs/name/lengocphuc99/bsc_testnet-blocks',
  KASPLEX_TESTNET: 'https://graph.kaspafinance.io/subgraphs/name/blocks',
  KASPLEX_MAINNET: "https://gateway.thegraph.com/api/e2d66e372446eaac5ac26924208834a8/subgraphs/id/9dSPXfKXaqYpoGAPXx96LyDF1VYR8PiT6HA7HRKEGRdS",
}

export const multiChainStartTime = {
  BSC: PCS_V2_START,
  ETH: PCS_ETH_START,
}

export const multiChainId = {
  BSC: ChainId.BSC,
  ETH: ChainId.ETHEREUM,
  KASPLEX_TESTNET: ChainId.KASPLEX_TESTNET,
  KASPLEX_MAINNET: ChainId.KASPLEX_MAINNET,
}

export const multiChainPaths = {
  [ChainId.KASPLEX_TESTNET]: '',
  [ChainId.ETHEREUM]: '/eth',
  [ChainId.KASPLEX_MAINNET]: '/kasplex-mainnet',
}

export const multiChainQueryClient = {
  BSC: infoClient,
  ETH: infoClientETH,
}

export const multiChainQueryEndPoint = {
  BSC: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainScan = {
  BSC: 'BscScan',
  ETH: 'EtherScan',
}

export const multiChainTokenBlackList = {
  BSC: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
}

export const multiChainTokenWhiteList = {
  BSC: BSC_TOKEN_WHITELIST,
  ETH: ETH_TOKEN_WHITELIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainNameExtend): GraphQLClient => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const v2SubgraphTokenName = {
  '0x738d96caf7096659db4c1afbf1e1bdfd281f388c': 'Ankr Staked MATIC',
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
