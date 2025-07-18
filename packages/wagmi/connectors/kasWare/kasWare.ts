import { UserRejectedRequestError, getAddress, encodeFunctionData } from 'viem'
import { Connector, Chain, ConnectorNotFoundError, WalletClient } from 'wagmi'

export class KasWareUserRejectedRequestError extends Error {
  name = 'KasWareUserRejectedRequestError'

  message = 'User rejected request'
}

interface KasWareProvider {
  // Native KasWare methods
  requestAccounts: () => Promise<string[]>
  getAccounts: () => Promise<string[]>
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
  getVersion: () => Promise<string>
  on: (event: string, handler: (...args: any[]) => void) => void
  removeListener: (event: string, handler: (...args: any[]) => void) => void

  // Ethereum-compatible interface
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>
    selectedAddress: string | null
    chainId: string
    networkVersion: string
    isConnected: () => boolean
    enable: () => Promise<string[]>
    on: (event: string, handler: (...args: any[]) => void) => void
    removeListener: (event: string, handler: (...args: any[]) => void) => void
    sendAsync: (request: any, callback: (error: any, response: any) => void) => void
    send: (request: any, callback?: (error: any, response: any) => void) => any
  }
}

export class KasWareConnector extends Connector<KasWareProvider | undefined, Record<string, never>> {
  readonly id = 'kasWare'

  readonly name = 'KasWare'

  readonly ready = typeof window !== 'undefined' && Boolean(window.kasware)

  provider?: KasWareProvider

  private publicKey: string | null = null

  constructor(config: { chains?: Chain[]; options?: any } = {}) {
    super({ chains: config.chains, options: config.options || {} })
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()

      // Set up event listeners on the ethereum interface
      if (provider.ethereum?.on) {
        provider.ethereum.on('accountsChanged', this.onAccountsChanged)
        provider.ethereum.on('chainChanged', this.onChainChanged)
        provider.ethereum.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      // Step 1: Ensure correct network
      try {
        await KasWareConnector.ensureNetwork(provider, 'testnet')
      } catch (error) {
        console.warn('Failed to switch network:', error)
      }

      // Step 2: Request accounts using Ethereum interface
      if (!provider.ethereum) {
        throw new Error('Ethereum interface not available')
      }
      const accounts = await provider.ethereum.enable()
      if (!accounts || accounts.length === 0) {
        throw new UserRejectedRequestError(new Error('No accounts found'))
      }

      // Get the first account (Ethereum address)
      const account = accounts[0] as `0x${string}`

      const id = chainId || this.chains?.[0]?.id || 167012
      const unsupported = this.isChainUnsupported(id)

      return { account, chain: { id, unsupported }, provider }
    } catch (error) {
      if (KasWareConnector.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error as Error)
      }
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider) return

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      await provider.disconnect(origin)
    } catch (error) {
      console.warn('Disconnect error:', error)
    }

    if (provider.ethereum?.removeListener) {
      provider.ethereum.removeListener('accountsChanged', this.onAccountsChanged)
      provider.ethereum.removeListener('chainChanged', this.onChainChanged)
      provider.ethereum.removeListener('disconnect', this.onDisconnect)
    }

    this.publicKey = null
    this.emit('disconnect')
  }

  async getAccount() {
    const provider = await this.getProvider()
    if (!provider || !provider.ethereum) throw new ConnectorNotFoundError()

    // Try to ensure correct network
    try {
      await KasWareConnector.ensureNetwork(provider, 'testnet')
    } catch (error) {
      console.warn('Network switch failed:', error)
    }

    // Get account directly from the ethereum interface
    if (provider.ethereum.selectedAddress) {
      return getAddress(provider.ethereum.selectedAddress)
    }

    // Fallback: request accounts
    const accounts = await provider.ethereum.request({ method: 'eth_accounts' })
    if (accounts && accounts.length > 0) {
      return getAddress(accounts[0])
    }

    throw new Error('No accounts found')
  }

  async getChainId() {
    const provider = await this.getProvider()
    if (!provider) return this.chains?.[0]?.id || 167012

    try {
      // Use ethereum interface to get chain ID
      if (provider.ethereum && provider.ethereum.chainId) {
        return parseInt(provider.ethereum.chainId, 16)
      }

      // Fallback to network method
      const network = await provider.getNetwork()
      // Convert network string to numeric chain ID
      switch (network.toString()) {
        case '0':
          return 167012 // Testnet
        case '1':
          return 1 // Mainnet
        default:
          return 167012 // Default to testnet
      }
    } catch {
      return this.chains?.[0]?.id || 167012
    }
  }

  async getProvider() {
    if (typeof window !== 'undefined' && window.kasware) {
      this.provider = window.kasware as KasWareProvider
      return this.provider
    }
    return undefined
  }

  // Helper function to convert BigInt values to hex strings
  private static convertBigIntToHex(value: any): any {
    if (typeof value === 'bigint') {
      return `0x${value.toString(16)}`
    }
    if (Array.isArray(value)) {
      return value.map((item) => KasWareConnector.convertBigIntToHex(item))
    }
    if (typeof value === 'object' && value !== null) {
      const converted: any = {}
      for (const [key, val] of Object.entries(value)) {
        converted[key] = KasWareConnector.convertBigIntToHex(val)
      }
      return converted
    }
    return value
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    try {
      await KasWareConnector.ensureNetwork(provider, 'testnet')
    } catch (error) {
      console.warn('Network switch failed:', error)
    }

    const account = await this.getAccount()
    const chain = this.chains.find((c) => c.id === (chainId || this.chains[0]?.id))
    if (!chain) throw new Error('Chain not found')

    const transport = {
      type: 'custom' as const,
      request: async ({ method, params }: { method: string; params?: unknown[] }) => {
        // Use ethereum interface for requests
        if (method === 'eth_requestAccounts') {
          if (!provider.ethereum) throw new Error('Ethereum interface not available')
          return provider.ethereum.enable()
        }
        if (method === 'eth_accounts') {
          if (!provider.ethereum) throw new Error('Ethereum interface not available')
          return provider.ethereum.request({ method: 'eth_accounts' })
        }
        if (method === 'eth_chainId') {
          if (!provider.ethereum) throw new Error('Ethereum interface not available')
          return provider.ethereum.chainId
        }
        if (method === 'personal_sign') {
          return provider.signMessage(params?.[0] as string)
        }
        if (method === 'eth_sendTransaction') {
          if (!provider.ethereum) throw new Error('Ethereum interface not available')
          // Convert any BigInt values in the params and validate data field
          const convertedParams = params ? KasWareConnector.convertBigIntToHex(params) : params

          // Extra validation for transaction data
          if (convertedParams && Array.isArray(convertedParams) && convertedParams[0]) {
            const tx = convertedParams[0]
            if (tx.data && tx.data !== '0x') {
              // Ensure the data field is preserved
              if (!tx.data.startsWith('0x')) {
                tx.data = `0x${tx.data}`
              }
            }
          }

          return provider.ethereum.request({ method: 'eth_sendTransaction', params: convertedParams })
        }
        if (method === 'eth_sendRawTransaction') {
          if (!provider.ethereum) throw new Error('Ethereum interface not available')
          return provider.ethereum.request({ method: 'eth_sendRawTransaction', params })
        }
        if (method === 'eth_estimateGas') {
          if (!provider.ethereum) throw new Error('Ethereum interface not available')
          return provider.ethereum.request({ method: 'eth_estimateGas', params })
        }
        if (method === 'eth_gasPrice') {
          if (!provider.ethereum) throw new Error('Ethereum interface not available')
          return provider.ethereum.request({ method: 'eth_gasPrice', params })
        }
        if (method === 'eth_getTransactionCount') {
          if (!provider.ethereum) throw new Error('Ethereum interface not available')
          return provider.ethereum.request({ method: 'eth_getTransactionCount', params })
        }
        if (method === 'eth_getBalance') {
          try {
            // First try using ethereum interface
            if (provider.ethereum) {
              const ethBalance = await provider.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest'],
              })
              if (ethBalance) return ethBalance
            }

            // Fallback to native balance method
            const balance = await provider.getBalance()
            // Convert sompi to wei (1 KAS = 100,000,000 sompi)
            const wei = BigInt(balance.total) * BigInt(10000000000)
            return `0x${wei.toString(16)}`
          } catch (error) {
            return '0x0'
          }
        }

        // Forward other requests to ethereum interface
        if (!provider.ethereum) throw new Error('Ethereum interface not available')
        return provider.ethereum.request({ method, params })
      },
    }

    return {
      account: { address: account, type: 'json-rpc' },
      chain,
      transport,
      // Add the writeContract method
      writeContract: async (args: any) => {
        const { address, abi, functionName, args: contractArgs, value, gas, gasPrice } = args

        // Validate required parameters
        if (!address) throw new Error('Contract address is required')
        if (!abi) throw new Error('Contract ABI is required')
        if (!functionName) throw new Error('Function name is required')

        // Build transaction data
        const data = encodeFunctionData({
          abi,
          functionName,
          args: contractArgs || [],
        })

        // Ensure data is properly formatted
        if (!data || data === '0x') {
          throw new Error('Failed to encode function data')
        }

        // Prepare transaction parameters
        const txParams = {
          from: account,
          to: address.toLowerCase(),
          data,
          value: value ? `0x${BigInt(value).toString(16)}` : '0x0',
          ...(gas && { gas: `0x${BigInt(gas).toString(16)}` }),
          ...(gasPrice && { gasPrice: `0x${BigInt(gasPrice).toString(16)}` }),
        }

        // Validate transaction parameters before sending
        if (!txParams.to || !txParams.data) {
          throw new Error('Invalid transaction parameters')
        }

        // Convert all BigInt values to hex strings recursively
        const convertedParams = KasWareConnector.convertBigIntToHex(txParams)

        if (!provider.ethereum) throw new Error('Ethereum interface not available')
        return provider.ethereum.request({
          method: 'eth_sendTransaction',
          params: [convertedParams],
        })
      },
      // Add other required methods
      sendTransaction: async (args: any) => {
        // Prepare transaction parameters with proper conversion
        const txParams = {
          from: account,
          to: args.to?.toLowerCase(),
          value: args.value ? `0x${BigInt(args.value).toString(16)}` : '0x0',
          data: args.data || '0x',
          ...(args.gas && { gas: `0x${BigInt(args.gas).toString(16)}` }),
          ...(args.gasPrice && { gasPrice: `0x${BigInt(args.gasPrice).toString(16)}` }),
          ...(args.maxFeePerGas && { maxFeePerGas: `0x${BigInt(args.maxFeePerGas).toString(16)}` }),
          ...(args.maxPriorityFeePerGas && {
            maxPriorityFeePerGas: `0x${BigInt(args.maxPriorityFeePerGas).toString(16)}`,
          }),
          ...(args.nonce && { nonce: `0x${BigInt(args.nonce).toString(16)}` }),
        }

        // Convert all BigInt values to hex strings recursively
        const convertedParams = KasWareConnector.convertBigIntToHex(txParams)

        if (!provider.ethereum) throw new Error('Ethereum interface not available')
        return provider.ethereum.request({
          method: 'eth_sendTransaction',
          params: [convertedParams],
        })
      },
      signMessage: async ({ message }: { message: string }) => {
        return provider.signMessage(message)
      },
      signTransaction: async (transaction: any) => {
        // Convert BigInt values in transaction
        const convertedTransaction = KasWareConnector.convertBigIntToHex(transaction)

        if (!provider.ethereum) throw new Error('Ethereum interface not available')
        return provider.ethereum.request({
          method: 'eth_signTransaction',
          params: [convertedTransaction],
        })
      },
    } as unknown as WalletClient
  }

  private static async ensureNetwork(
    provider: KasWareProvider,
    targetNetwork: 'mainnet' | 'testnet' | 'devnet',
  ): Promise<void> {
    try {
      const currentNetwork = await provider.getNetwork()
      const networkMap: Record<string, string> = {
        '0': 'testnet',
        '1': 'mainnet',
        '2': 'devnet',
      }

      const currentNetworkName = networkMap[currentNetwork.toString()] || 'testnet'

      if (currentNetworkName !== targetNetwork) {
        await provider.switchNetwork(targetNetwork)
        // Wait for network change propagation
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error('Network error:', error)
      throw new Error(`Failed to switch to ${targetNetwork}`)
    }
  }

  async isAuthorized() {
    try {
      const provider = await this.getProvider()
      if (!provider || !provider.ethereum) return false

      // Check if the ethereum interface reports as connected
      if (!provider.ethereum.isConnected()) return false

      // Check if we have accounts via ethereum interface
      const accounts = await provider.ethereum.request({ method: 'eth_accounts' })
      if (!accounts || accounts.length === 0) return false

      // Verify we have a valid selected address
      return Boolean(provider.ethereum.selectedAddress)
    } catch (error) {
      return false
    }
  }

  protected onAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit('disconnect')
      return
    }

    try {
      const provider = await this.getProvider()
      if (provider) {
        this.publicKey = await provider.getPublicKey()
        const formattedAccount = await this.getAccount()
        this.emit('change', { account: formattedAccount })
      }
    } catch (error) {
      console.warn('Account change error:', error)
    }
  }

  protected onNetworkChanged = async (_network: string) => {
    try {
      const chainId = await this.getChainId()
      this.emit('change', { chain: { id: chainId, unsupported: false } })
    } catch (error) {
      console.warn('Network change error:', error)
    }
  }

  protected onBalanceChanged = () => {
    this.emit('change', { chain: { id: this.chains?.[0]?.id || 167012, unsupported: false } })
  }

  protected onChainChanged = (chainId: string | number) => {
    const id = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect = (_error?: Error) => {
    this.publicKey = null
    this.emit('disconnect')
  }

  protected static isUserRejectedRequestError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('rejected')
  }
}
