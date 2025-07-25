import { ChainId } from '@pancakeswap/sdk'
// import ethereum from '../swapUtils/ethereum'
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'
export const KNC_COINGECKO_ID = 'kyber-network-crystal'

// const NativeCurrenciesLocal: { [chainId in ChainId]: NativeCurrency } = SUPPORTED_NETWORKS.reduce(
//   (acc, chainId) => ({
//     ...acc,
//     [chainId]: new NativeCurrency(
//       chainId,
//       NETWORKS_INFO[chainId].nativeToken.decimal,
//       NETWORKS_INFO[chainId].nativeToken.symbol,
//       NETWORKS_INFO[chainId].nativeToken.name,
//     ),
//   }),
//   {},
// ) as { [chainId in ChainId]: NativeCurrency }

export const NETWORKS_INFO_CONFIG: { [key: number]: { coingeckoNetworkId: string; coingeckoNativeTokenId: string } } = {
  [ChainId.ETHEREUM]: {
    coingeckoNetworkId: 'ethereum',
    coingeckoNativeTokenId: 'ethereum',
  },
  [ChainId.ARBITRUM_ONE]: { coingeckoNetworkId: 'arbitrum-one', coingeckoNativeTokenId: 'ethereum' },
  [ChainId.ARBITRUM_GOERLI]: { coingeckoNetworkId: 'arbitrum-one', coingeckoNativeTokenId: 'ethereum' },
  [ChainId.BSC]: { coingeckoNetworkId: 'bsc', coingeckoNativeTokenId: 'ethereum' },
  [ChainId.BSC_TESTNET]: { coingeckoNetworkId: 'bsc', coingeckoNativeTokenId: 'ethereum' },
  [ChainId.KASPLEX_TESTNET]: { coingeckoNetworkId: 'kas', coingeckoNativeTokenId: 'kas' },
} as const

// this Proxy helps fallback undefined ChainId by Ethereum info

export const NETWORKS_INFO = new Proxy(NETWORKS_INFO_CONFIG, {
  get(target, p) {
    const prop = p as any as ChainId
    if (p && target[prop]) return target[prop]
    return target[ChainId.ETHEREUM]
  },
})
