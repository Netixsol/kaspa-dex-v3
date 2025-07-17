import { ChainId } from '@pancakeswap/sdk'
import { OnChainProvider } from '@pancakeswap/smart-router/evm'
import { createPublicClient, http, Chain } from 'viem'
import { bsc, bscTestnet, goerli, mainnet } from 'wagmi/chains'

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
})

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_NODE),
})

const bscTestnetClient = createPublicClient({
  chain: bscTestnet,
  transport: http(BSC_TESTNET_NODE),
})
const kasplexTestnetClient = createPublicClient({
  chain: kasplexTestnet,
  transport: http(KASPLEX_TESTNET_NODE),
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
})

// @ts-ignore
export const viemProviders: OnChainProvider = ({ chainId }: { chainId?: ChainId }) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return mainnetClient
    case ChainId.BSC:
      return bscClient
    case ChainId.BSC_TESTNET:
      return bscTestnetClient
    case ChainId.KASPLEX_TESTNET:
      return kasplexTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    default:
      return bscClient
  }
}
