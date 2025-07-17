import { ChainId } from '@pancakeswap/sdk'
import { createPublicClient, http, PublicClient } from 'viem'
import { bsc, bscTestnet, Chain, goerli, mainnet } from 'viem/chains'

const requireCheck = [ETH_NODE, GOERLI_NODE, BSC_NODE, BSC_TESTNET_NODE, KASPLEX_TESTNET_NODE]
requireCheck.forEach((node) => {
  if (!node) {
    throw new Error('Missing env var')
  }
})

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

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(ETH_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const bscClient: PublicClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const bscTestnetClient: PublicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(BSC_TESTNET_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const kasplexTestnetClient: PublicClient = createPublicClient({
  chain: kasplexTestnet,
  transport: http(KASPLEX_TESTNET_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const viemProviders = ({ chainId }: { chainId?: ChainId }): PublicClient => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return mainnetClient
    case ChainId.BSC:
      return bscClient
    case ChainId.BSC_TESTNET:
      return bscTestnetClient
    case ChainId.KASPLEX_TESTNET:
      return bscTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    default:
      return bscClient
  }
}
