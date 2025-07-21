import { WalletConfigV2 } from '@pancakeswap/ui-wallets'
import { WalletFilledIcon } from '@pancakeswap/uikit'
import type { ExtendEthereum } from 'global'
import { isFirefox } from 'react-device-detect'
import { getTrustWalletProvider } from '@pancakeswap/wagmi/connectors/trustWallet'
import { walletConnectNoQrCodeConnector } from '../utils/wagmi'
import { ASSET_CDN } from './constants/endpoints'

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnectLegacy',
  BSC = 'bsc',
  Blocto = 'blocto',
  WalletLink = 'coinbaseWallet',
  Ledger = 'ledger',
  TrustWallet = 'trustWallet',
  kastleWallet = 'kastleWallet',
  kasKeeper = 'kasKeeper',
  kasWare = 'kasWare',
}

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t))

const createQrCode = (chainId: number, connect) => async () => {
  connect({ connector: walletConnectNoQrCodeConnector, chainId })

  // wait for WalletConnect to setup in order to get the uri
  await delay(100)
  const { uri } = ((await walletConnectNoQrCodeConnector.getProvider()) as any).connector

  return uri
}

const isMetamaskInstalled = () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.ethereum?.isMetaMask) {
    return true
  }

  if (window.ethereum?.providers?.some((p) => p.isMetaMask)) {
    return true
  }

  return false
}
const isKastleWalletInstalled = () => {
  if (typeof window === 'undefined') {
    return false
  }
  return Boolean(window.kastle?.ethereum)
}
const isKasKeeperInstalled = () => {
  if (typeof window === 'undefined') {
    return false
  }
  return Boolean(window?.Kaskeeper?._isConnected)
}

const isKasWareInstalled = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return Boolean(window?.kasware?.ethereum?._isConnected) || Boolean(window?.kasware)
}

const walletsConfig = ({
  chainId,
  connect,
}: {
  chainId: number
  connect: (connectorID: ConnectorNames) => void
}): WalletConfigV2<ConnectorNames>[] => {
  const qrCode = createQrCode(chainId, connect)
  return [
    {
      id: 'metamask',
      title: 'Metamask',
      icon: `${ASSET_CDN}/images/wallets/metamask.png`,
      get installed() {
        return isMetamaskInstalled()
        // && metaMaskConnector.ready
      },
      connectorId: ConnectorNames.MetaMask,
      deepLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
      qrCode,
      downloadLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
    },
    {
      id: 'kasKeeper',
      title: 'KasKeeper Wallet',
      icon: `data:image/png;base64,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`,
      connectorId: ConnectorNames.kasKeeper,
      get installed() {
        return isKasKeeperInstalled()
      },
      downloadLink:
        'https://chromewebstore.google.com/detail/kaskeeper/bicbpicnddlclhekbmgafcbkemdikdem?authuser=0&hl=en-GB',
      guide: {
        desktop: 'https://kaskeeper.vercel.app/dapp-api',
        mobile: 'https://kaskeeper.vercel.app/dapp-api',
      },
    },
    {
      id: 'kasWare',
      title: 'kasWare Wallet',
      icon: `https://pbs.twimg.com/profile_images/1890799584135520256/ILHcmauh_400x400.png`,
      connectorId: ConnectorNames.kasWare,
      get installed() {
        return isKasWareInstalled()
      },
      downloadLink:
        'https://chromewebstore.google.com/detail/kasware-wallet/hklhheigdmpoolooomdihmhlpjjdbklf?v=1752064422341',
      guide: {
        desktop: 'https://docs.kasware.xyz/',
        mobile: 'https://docs.kasware.xyz/',
      },
    },
    {
      id: 'kastleWallet',
      title: 'Kastle Wallet',
      icon: `https://cms.forbole.com/uploads/Kastle_Symbolic_Logo_27731fc6bd.svg`,
      connectorId: ConnectorNames.kastleWallet,
      get installed() {
        return isKastleWalletInstalled()
      },
      downloadLink: 'https://chromewebstore.google.com/detail/kastle/oambclflhjfppdmkghokjmpppmaebego?authuser=0&hl=en',
      guide: {
        desktop: 'https://docs.kastle.cc/getting-started/installation',
        mobile: 'https://docs.kastle.cc/getting-started/mobile-setup',
      },
    },
    {
      id: 'binance',
      title: 'Binance Wallet',
      icon: `${ASSET_CDN}/images/wallets/binance.png`,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.BinanceChain)
      },
      connectorId: ConnectorNames.BSC,
      guide: {
        desktop: 'https://www.bnbchain.org/en/binance-wallet',
      },
      downloadLink: {
        desktop: isFirefox
          ? 'https://addons.mozilla.org/en-US/firefox/addon/binance-chain/?src=search'
          : 'https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
      },
    },
    {
      id: 'coinbase',
      title: 'Coinbase Wallet',
      icon: `${ASSET_CDN}/images/wallets/coinbase.png`,
      connectorId: ConnectorNames.WalletLink,
    },
    {
      id: 'trust',
      title: 'Trust Wallet',
      icon: `${ASSET_CDN}/images/wallets/trust.png`,
      connectorId: ConnectorNames.TrustWallet,
      get installed() {
        return !!getTrustWalletProvider()
      },
      // deepLink: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=https://pancakeswap.finance/',
      deepLink: '',
      downloadLink: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
      guide: {
        desktop: 'https://trustwallet.com/browser-extension',
        mobile: 'https://trustwallet.com/',
      },
      qrCode,
    },
    {
      id: 'walletconnect',
      title: 'WalletConnect',
      icon: `${ASSET_CDN}/images/wallets/walletconnect.png`,
      connectorId: ConnectorNames.WalletConnect,
    },
    {
      id: 'opera',
      title: 'Opera Wallet',
      icon: `${ASSET_CDN}/images/wallets/opera.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera)
      },
      downloadLink: 'https://www.opera.com/crypto/next',
    },
    {
      id: 'brave',
      title: 'Brave Wallet',
      icon: `${ASSET_CDN}/images/wallets/brave.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet)
      },
      downloadLink: 'https://brave.com/wallet/',
    },
    {
      id: 'math',
      title: 'MathWallet',
      icon: `${ASSET_CDN}/images/wallets/mathwallet.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet)
      },
      qrCode,
    },
    {
      id: 'tokenpocket',
      title: 'TokenPocket',
      icon: `${ASSET_CDN}/images/wallets/tokenpocket.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket)
      },
      qrCode,
    },
    {
      id: 'safepal',
      title: 'SafePal',
      icon: `${ASSET_CDN}/images/wallets/safepal.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isSafePal)
      },
      downloadLink:
        'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
      qrCode,
    },
    {
      id: 'coin98',
      title: 'Coin98',
      icon: `${ASSET_CDN}/images/wallets/coin98.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return (
          typeof window !== 'undefined' &&
          (Boolean((window.ethereum as ExtendEthereum)?.isCoin98) || Boolean(window.coin98))
        )
      },
      qrCode,
    },
    {
      id: 'blocto',
      title: 'Blocto',
      icon: `${ASSET_CDN}/images/wallets/blocto.png`,
      connectorId: ConnectorNames.Blocto,
      get installed() {
        return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto)
          ? true
          : undefined // undefined to show SDK
      },
    },
    {
      id: 'ledger',
      title: 'Ledger',
      icon: `${ASSET_CDN}/images/wallets/ledger.png`,
      connectorId: ConnectorNames.Ledger,
    },
  ]
}

export const createWallets = (chainId: number, connect: any) => {
  const hasInjected = typeof window !== 'undefined' && !window.ethereum
  const config = walletsConfig({ chainId, connect })
  return hasInjected && config.some((c) => c.installed && c.connectorId === ConnectorNames.Injected)
    ? config // add injected icon if none of injected type wallets installed
    : [
        ...config,
        {
          id: 'injected',
          title: 'Injected',
          icon: WalletFilledIcon,
          connectorId: ConnectorNames.Injected,
          installed: typeof window !== 'undefined' && Boolean(window.ethereum),
        },
      ]
}

const docLangCodeMapping: Record<string, string> = {
  it: 'italian',
  ja: 'japanese',
  fr: 'french',
  tr: 'turkish',
  vi: 'vietnamese',
  id: 'indonesian',
  'zh-cn': 'chinese',
  'pt-br': 'portuguese-brazilian',
}

export const getDocLink = (code: string) =>
  docLangCodeMapping[code]
    ? `#`
    : `#`
