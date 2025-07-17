import { ChainId } from '@pancakeswap/sdk'
import memoize from 'lodash/memoize'
import invert from 'lodash/invert'
import { bsc as bsc_, bscTestnet, goerli, mainnet, Chain } from 'wagmi/chains'

export const CHAIN_QUERY_NAME = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.GOERLI]: 'goerli',
  [ChainId.BSC]: 'bsc',
  [ChainId.BSC_TESTNET]: 'bscTestnet',
  [ChainId.KASPLEX_TESTNET]: 'kasplexTestnet',
} as const satisfies Record<ChainId, string>

export const kasplexTestnet = {
  id: 167012,
  name: 'Kasplex Testnet',
  network: 'KasplexTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'KAS',
    symbol: 'KAS',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.kasplextest.xyz/'],
    },
    public: {
      http: ['https://rpc.kasplextest.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Kasplex Explorer',
      url: 'https://frontend.kasplextest.xyz/',
    },
  },
  contracts: {
    multicall3: {
      address: '0x1Df5fF99ce9C75510f8Fa3D8D507879128825e3D',
    },
  },
  testnet: true,
} as const satisfies Chain

const CHAIN_QUERY_NAME_TO_ID = invert(CHAIN_QUERY_NAME)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName] ? +CHAIN_QUERY_NAME_TO_ID[chainName] : undefined
})

const bsc = {
  ...bsc_,
  rpcUrls: {
    ...bsc_.rpcUrls,
    public: {
      ...bsc_.rpcUrls.public,
      http: ['https://bsc-dataseed.binance.org/'],
    },
    default: {
      ...bsc_.rpcUrls.default,
      http: ['https://bsc-dataseed.binance.org/'],
    },
  },
} satisfies Chain

export const CHAINS = [bsc, mainnet, bscTestnet, goerli, kasplexTestnet]
