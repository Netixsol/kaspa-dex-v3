import type { WindowProvider } from 'wagmi/window'

export interface ExtendEthereum extends WindowProvider {
  isSafePal?: true
  isCoin98?: true
  isBlocto?: true
  isMathWallet?: true
  isTrustWallet?: true
  isBlocto?: true
  isKasWare?: true
}

declare global {
  interface Window {
    coin98?: true
    ethereum?: ExtendEthereum
    BinanceChain?: {
      bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
      switchNetwork?: (networkId: string) => Promise<string>
    } & Ethereum
    kastle?: {
      ethereum(ethereum: any): unknown
    }
    Kaskeeper?: {
      requestAccounts: () => Promise<string[]>
      getAccounts: () => Promise<string[]>
      disconnect: () => Promise<boolean>
      getBalance: () => Promise<{ total: number }>
      getPublicKey: () => Promise<string>
      getNetwork: () => Promise<string>
      switchNetwork: (network: string) => Promise<void>
      getLayer: () => Promise<string>
      switchLayer: (layer: string) => Promise<void>
      signMessage: (message: string) => Promise<string>
      verifyMessage: (message: string, signature: string) => Promise<boolean>
      getKRC20Balance: () => Promise<any[]>
      signKRC20Transaction: (params: any) => Promise<string>
      sendKaspa: (toAddress: string, amount: number, options?: any) => Promise<string>
      sendKRC200: (toAddress: string, amount: number, krc20Details: any, options?: any) => Promise<string>
      sendL2Kaspa: (toAddress: string, amount: number, options?: any) => Promise<string>
      sendL2Specailtx: (
        toAddress: string,
        amount: number,
        tokenContractAddress: string,
        options?: any,
      ) => Promise<string>
      sendL2ERC20: (payload: any, options?: any) => Promise<string>
      on: (event: string, handler: (...args: any[]) => void) => void
      removeListener?: (event: string, handler: (...args: any[]) => void) => void
      _isConnected?: boolean
    }
    kasware?: {
      ethereum?: ExtendEthereum
      requestAccounts: () => Promise<string[]>
      getAccounts: () => Promise<string[]>
      getVersion: () => Promise<string>
      disconnect: (origin?: string) => Promise<void>
      getBalance: () => Promise<{ confirmed: number; unconfirmed: number; total: number }>
      getPublicKey: () => Promise<string>
      getNetwork: () => Promise<string>
      switchNetwork: (network: string) => Promise<string>
      signMessage: (message: string, type?: 'ecdsa' | 'bip322-simple') => Promise<string>
      verifyMessage: (publicKey: string, message: string, signature: string) => Promise<boolean>
      getKRC20Balance: () => Promise<
        Array<{ balance: string; dec: string; locked: string; opScoreMod: string; tick: string }>
      >
      signKRC20Transaction: (
        inscribeJsonString: string,
        type: number,
        destAddr?: string,
        priorityFee?: number,
      ) => Promise<string>
      sendKaspa: (
        toAddress: string,
        sompi: number,
        options?: { priorityFee?: number; payload?: string },
      ) => Promise<string>
      getUtxoEntries: () => Promise<any[]>
      signPskt: (options: {
        txJsonString: string
        options: { signInputs: Array<{ index: number; sighashType: number }> }
      }) => Promise<string>
      buildScript: (options: { type: string; data: string }) => Promise<{ script: string; p2shAddress: string }>
      submitCommitReveal: (commit: any, reveal: any, script: string, networkId: string) => Promise<any>
      createKRC20Order: (options: {
        krc20Tick: string
        krc20Amount: number | string
        kasAmount: number
        psktExtraOutput?: Array<{ address: string; amount: number }>
        priorityFee?: number
      }) => Promise<{ txJsonString: string; sendCommitTxId: string }>
      buyKRC20Token: (options: {
        txJsonString: string
        extraOutput?: Array<{ address: string; amount: number }>
        priorityFee?: number
      }) => Promise<string>
      cancelKRC20Order: (options: {
        krc20Tick: string
        txJsonString?: string
        sendCommitTxId?: string
      }) => Promise<string>
      on: (event: string, handler: (data: any) => void) => void
      removeListener: (event: string, handler: (data: any) => void) => void
    }
  }
}

export {}
