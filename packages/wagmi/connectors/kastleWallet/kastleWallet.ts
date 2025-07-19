import { InjectedConnector } from 'wagmi/connectors/injected'
import { Chain } from 'wagmi'

function getWindowProviderNamespace(namespace: string): any {
  const providerSearch = (provider: any, searchNamespace: string): any => {
    const [property, ...path] = searchNamespace.split('.')
    const _provider = provider[property]
    if (_provider) {
      if (path.length === 0) return _provider
      return providerSearch(_provider, path.join('.'))
    }
    return undefined
  }
  if (typeof window === 'undefined') return undefined
  const provider = providerSearch(window, namespace)
  return provider || undefined
}

export class KastleWalletConnector extends InjectedConnector {
  readonly id = 'kastleWallet'

  readonly name = 'Kastle'

  constructor(config: { chains?: Chain[]; options?: any } = {}) {
    super({
      chains: config.chains,
      options: {
        name: 'Kastle',
        shimDisconnect: true,
        getProvider: () => getWindowProviderNamespace('kastle.ethereum'),
        ...config.options,
      },
    })
  }
}

export { getWindowProviderNamespace }
