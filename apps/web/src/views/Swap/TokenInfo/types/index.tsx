import { ChainId } from '@moonbase/sdk'
import { NETWORKS_INFO } from '../constants'

export interface NetworkInfo {
  readonly chainId: ChainId

  // route can be used to detect which chain is favored in query param, check out useActiveNetwork.ts
  readonly route: string
  readonly ksSettingRoute: string
  readonly priceRoute: string
  readonly aggregatorRoute: string
  readonly name: string
  readonly icon: string
  readonly iconDark: string | null
  readonly iconSelected: string | null
  readonly iconDarkSelected: string | null
  readonly etherscanUrl: string
  readonly etherscanName: string
  readonly bridgeURL: string
  readonly nativeToken: {
    readonly symbol: string
    readonly name: string
    readonly logo: string
    readonly decimal: number
    readonly minForGas: number
  }
  readonly coingeckoNetworkId: string | null // https://api.coingecko.com/api/v3/asset_platforms
  readonly coingeckoNativeTokenId: string | null // https://api.coingecko.com/api/v3/coins/list
  readonly tokenListUrl: string
  readonly trueSightId: string | null
  readonly dexToCompare: string | null
  readonly limitOrder: {
    development: string | null
    production: string | null
  }
  readonly defaultRpcUrl: string
  // token: {
  //   DAI: Token
  //   USDC: Token
  //   USDT: Token
  // }
}

export interface SolanaNetworkInfo extends NetworkInfo {
  readonly classic: {
    readonly pool: string
    readonly factory: string
    readonly router: string
  }
  aggregatorProgramAddress: string
  openBookAddress: any
}
export const SUPPORTED_NETWORKS = Object.keys(NETWORKS_INFO).map(Number) as ChainId[]

export type EVM_NETWORK = any

export type NETWORKS_INFO_CONFIG_TYPE = { [chainId in EVM_NETWORK]: EVMNetworkInfo } & {
  [chainId in ChainId.ARBITRUM_ONE]: SolanaNetworkInfo
}
export interface EVMNetworkInfo extends NetworkInfo {
  readonly poolFarmRoute: string // use this to get data from our internal BE
  readonly defaultBlockSubgraph: string
  readonly multicall: string
  readonly classic: {
    readonly defaultSubgraph: string
    readonly static: {
      readonly zap: string
      readonly router: string
      readonly factory: string
    }
    readonly oldStatic: {
      readonly zap: string
      readonly router: string
      readonly factory: string
    } | null
    readonly dynamic: {
      readonly zap: string
      readonly router: string
      readonly factory: string
    } | null
    readonly claimReward: string | null
    readonly fairlaunch: string[]
    readonly fairlaunchV2: string[]
  }
  readonly elastic: {
    readonly defaultSubgraph: string
    readonly startBlock: number
    readonly coreFactory: string
    readonly nonfungiblePositionManager: string
    readonly tickReader: string
    readonly initCodeHash: string
    readonly quoter: string
    readonly routers: string
    readonly farms: string[]
    readonly farmv2Quoter?: string
    readonly farmV2Contract?: string
  }
  readonly limitOrder: {
    development: string | null
    production: string | null
  }
  readonly averageBlockTimeInSeconds: number
  readonly deBankSlug: string
  readonly kyberDAO?: {
    readonly staking: string
    readonly dao: string
    readonly rewardsDistributor: string
    readonly daoStatsApi: string
    readonly KNCAddress: string
    readonly KNCLAddress: string
  }
}
