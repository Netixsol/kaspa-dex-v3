import { getAddress } from 'viem'
import memoize from 'lodash/memoize'

import { ChainId, Token } from '@pancakeswap/sdk'
import { ASSET_CDN } from 'config/constants/endpoints'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
}

// const getTokenLogoURL = memoize(
//   (token?: Token) => {
//     if (token && mapping[token.chainId]) {
//       const address = getAddress(token.address) // ensures checksummed address
//       return `/images/chains/${address}.png`
//     }
//     return null
//   },
//   (t) => `${t.chainId}#${t.address.toLowerCase()}`,
// )
const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token?.address) {
      console.log({ token })
      const address = getAddress(token.address) // checksummed
      return `${ASSET_CDN}/images/chains/${token.address.toLowerCase()}.png`
    }
    return null
  },
  (t) => `${t?.chainId}#${t?.address.toLowerCase()}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId]) {
      console.log({ address })
      return `${ASSET_CDN}/images/chains/${address}.png`
    }
    return null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
