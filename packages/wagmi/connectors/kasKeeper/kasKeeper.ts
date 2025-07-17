import { UserRejectedRequestError, getAddress, encodeFunctionData } from 'viem'
import { Connector, Chain, ConnectorNotFoundError, WalletClient } from 'wagmi'

// Custom error for KasKeeper user rejections
export class KasKeeperUserRejectedRequestError extends Error {
  name = 'KasKeeperUserRejectedRequestError'

  message = 'User rejected request'
}

// KasKeeper-specific interfaces
interface KasKeeperProvider {
  requestAccounts: () => Promise<string[]>
  getAccounts: () => Promise<string[]>
  disconnect: () => Promise<boolean>
  getBalance: () => Promise<{ total: number }>
  getPublicKey: () => Promise<string>
  getNetwork: () => Promise<string>
  switchNetwork: (network: string) => Promise<string>
  getLayer: () => Promise<string>
  switchLayer: (layer: string) => Promise<void>
  signMessage: (message: string) => Promise<string>
  verifyMessage: (message: string, signature: string) => Promise<boolean>
  sendL2Kaspa?: (toAddress: string, amount: number, feeRate?: number) => Promise<string>
  sendL2ERC20?: (contractAddress: string, toAddress: string) => Promise<string>
  sendL2Specailtx?: (toAddress: string, amount: number, data: string, feeRate?: number) => Promise<string>
  pushTx?: (rawtx: string) => Promise<string>
  on: (event: string, handler: (...args: any[]) => void) => void
  removeListener?: (event: string, handler: (...args: any[]) => void) => void
  _isConnected?: boolean
  _layer?: string
  _selectedAddress?: string
  _network?: string
}

export class KasKeeperConnector extends Connector<KasKeeperProvider | undefined, Record<string, never>> {
  readonly id = 'kasKeeper'

  readonly name = 'KasKeeper'

  readonly ready = typeof window !== 'undefined' && Boolean(window.Kaskeeper)

  provider?: KasKeeperProvider

  constructor(config: { chains?: Chain[]; options?: any } = {}) {
    super({
      chains: config.chains,
      options: config.options || {},
    })
  }

  // Helper function to convert Kaspa address to Ethereum-compatible address
  private static kaspaToEthAddress(kaspaAddress: string): string {
    // Remove the kaspa prefix and create a deterministic Ethereum address
    const cleanAddress = kaspaAddress.replace(/^kaspa(test)?:/, '')

    // Take first 40 characters and pad if needed, then add 0x prefix
    const ethHex = cleanAddress.slice(0, 40).padEnd(40, '0')
    return `0x${ethHex}`
  }

  private static convertBigIntToHex(value: any): any {
    if (typeof value === 'bigint') {
      return `0x${value.toString(16)}`
    }
    if (Array.isArray(value)) {
      return value.map((item) => KasKeeperConnector.convertBigIntToHex(item))
    }
    if (typeof value === 'object' && value !== null) {
      const converted: any = {}
      for (const [key, val] of Object.entries(value)) {
        converted[key] = KasKeeperConnector.convertBigIntToHex(val)
      }
      return converted
    }
    return value
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()

      // Set up event listeners
      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('networkChanged', this.onNetworkChanged)
        provider.on('layerChanged', this.onLayerChanged)
      }

      this.emit('message', { type: 'connecting' })

      // Step 1: Check and ensure we're on testnet
      await KasKeeperConnector.ensureTestnetNetwork(provider)

      // Step 2: Check and ensure we're on Layer 2
      await KasKeeperConnector.ensureLayer2(provider)

      // Step 3: Now request accounts - will return Kaspa addresses
      const accounts = await provider.requestAccounts()
      if (!accounts || accounts.length === 0) {
        throw new UserRejectedRequestError(new Error('No accounts found'))
      }

      // Step 4: Convert Kaspa address to Ethereum-compatible address
      const kaspaAddress = accounts[0]
      const account = getAddress(KasKeeperConnector.kaspaToEthAddress(kaspaAddress))

      // KasKeeper doesn't use standard chain IDs, so we'll default to a supported chain
      const id = chainId || this.chains?.[0]?.id || 167012 // Default to first available chain or Arbitrum
      const unsupported = this.isChainUnsupported(id)

      return { account, chain: { id, unsupported }, provider }
    } catch (error) {
      if (KasKeeperConnector.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error as Error)
      }
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider) return

    try {
      await provider.disconnect()
    } catch (error) {
      // Silently fail on disconnect
    }

    // Remove event listeners
    if (provider.removeListener) {
      provider.removeListener('accountsChanged', this.onAccountsChanged)
      provider.removeListener('networkChanged', this.onNetworkChanged)
      provider.removeListener('layerChanged', this.onLayerChanged)
    }

    this.emit('disconnect')
  }

  async getAccount() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    // Ensure we're on testnet and Layer 2 before getting accounts
    await KasKeeperConnector.ensureTestnetNetwork(provider)
    await KasKeeperConnector.ensureLayer2(provider)

    // Get accounts - will be Kaspa addresses
    const accounts = await provider.getAccounts()
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found')
    }

    // Convert Kaspa address to Ethereum-compatible address
    const kaspaAddress = accounts[0]
    return getAddress(KasKeeperConnector.kaspaToEthAddress(kaspaAddress))
  }

  async getChainId() {
    // KasKeeper doesn't use standard chain IDs
    // Return a default supported chain ID based on available chains
    return this.chains?.[0]?.id || 42161 // Arbitrum as default
  }

  async getProvider() {
    if (typeof window !== 'undefined' && window.Kaskeeper) {
      this.provider = window.Kaskeeper
      return this.provider
    }
    return undefined
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()

    // Ensure we're on testnet and Layer 2
    await KasKeeperConnector.ensureTestnetNetwork(provider)
    await KasKeeperConnector.ensureLayer2(provider)

    const account = await this.getAccount()
    const chain = this.chains.find((c) => c.id === (chainId || this.chains[0]?.id))
    if (!chain) throw new Error('Chain not found')

    // Return a wallet client that implements the required interface
    return {
      account: {
        address: account,
        type: 'json-rpc',
      },
      chain,
      transport: {
        type: 'custom',
        request: async ({ method, params }: { method: string; params?: unknown[] }) => {
          if (method === 'eth_requestAccounts') {
            const accounts = await provider.requestAccounts()
            const kaspaAddress = accounts[0]
            const ethAddress = KasKeeperConnector.kaspaToEthAddress(kaspaAddress)
            return [ethAddress]
          }
          if (method === 'eth_accounts') {
            const accounts = await provider.getAccounts()
            const kaspaAddress = accounts[0]
            const ethAddress = KasKeeperConnector.kaspaToEthAddress(kaspaAddress)
            return [ethAddress]
          }
          if (method === 'eth_chainId') {
            return `0x${chain.id.toString(16)}`
          }
          if (method === 'personal_sign' && Array.isArray(params)) {
            return provider.signMessage(params[0] as string)
          }
          if (method === 'eth_getBalance') {
            try {
              const balance = await provider.getBalance()
              return `0x${(balance.total || 0).toString(16)}`
            } catch (error) {
              return '0x0'
            }
          }
          if (method === 'net_version') {
            return chain.id.toString()
          }
          // Add basic transaction methods
          if (method === 'eth_sendTransaction') {
            // KasKeeper supports transactions on testnet + Layer 2
            if (!Array.isArray(params) || !params[0]) {
              throw new Error('Invalid transaction parameters')
            }

            const txParams = params[0] as any

            // Validate transaction parameters
            if (!txParams.to) {
              throw new Error('Transaction must have a recipient address')
            }

            // Ensure we're on the correct network and layer before transaction
            try {
              await KasKeeperConnector.ensureTestnetNetwork(provider)
              await KasKeeperConnector.ensureLayer2(provider)

              // Wait for network/layer switches to complete
              await new Promise((resolve) => setTimeout(resolve, 1000))

              // Convert BigInt values to hex
              const convertedParams = KasKeeperConnector.convertBigIntToHex(txParams)

              // Use KasKeeper's actual transaction methods
              if (provider.sendL2Specailtx && convertedParams.data && convertedParams.data !== '0x') {
                // Contract interaction with data
                const amount = convertedParams.value ? parseInt(convertedParams.value, 16) : 0
                return await provider.sendL2Specailtx(convertedParams.to, amount, convertedParams.data)
              }

              if (provider.sendL2Kaspa) {
                // Simple value transfer
                const amount = convertedParams.value ? parseInt(convertedParams.value, 16) : 0
                return await provider.sendL2Kaspa(convertedParams.to, amount)
              }

              throw new Error('KasKeeper transaction methods not available')
            } catch (error) {
              throw new Error(
                `KasKeeper transaction failed: ${error}. Please ensure you are on kaspa_testnet and Layer 2.`,
              )
            }
          }
          if (method === 'eth_estimateGas') {
            // Return a default gas estimate
            return '0x5208' // 21000 gas
          }
          if (method === 'eth_gasPrice') {
            // Return a default gas price
            return '0x9184e72a000' // 10 gwei
          }
          if (method === 'eth_getTransactionCount') {
            // Return default nonce
            return '0x0'
          }
          throw new Error(`Method ${method} not supported by KasKeeper`)
        },
      },
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

        // Ensure we're on the correct network and layer before transaction
        try {
          await KasKeeperConnector.ensureTestnetNetwork(provider)
          await KasKeeperConnector.ensureLayer2(provider)

          // Wait for network/layer switches to complete
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          throw new Error(`Failed to ensure correct network/layer: ${error}`)
        }

        // Prepare transaction parameters for KasKeeper
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

        // Use the KasKeeper transaction methods
        try {
          // Verify we have the required transaction methods
          if (!provider.sendL2Specailtx) {
            throw new Error('KasKeeper sendL2Specailtx method not available')
          }

          // Use sendL2Specailtx for contract calls with data
          const amount = value ? parseInt(`0x${BigInt(value).toString(16)}`, 16) : 0
          const result = await provider.sendL2Specailtx(txParams.to, amount, txParams.data)
          return result
        } catch (error) {
          throw new Error(`KasKeeper writeContract failed: ${error}. Contract call to ${functionName} on ${address}.`)
        }
      },
      // Add other required methods
      sendTransaction: async (args: any) => {
        // Ensure we're on the correct network and layer before transaction
        try {
          await KasKeeperConnector.ensureTestnetNetwork(provider)
          await KasKeeperConnector.ensureLayer2(provider)

          // Wait for network/layer switches to complete
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          throw new Error(`Failed to ensure correct network/layer: ${error}`)
        }

        // Prepare transaction parameters with proper validation
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
        const _convertedParams = KasKeeperConnector.convertBigIntToHex(txParams)

        // Validate required fields
        if (!txParams.to) {
          throw new Error('Transaction must have a recipient address')
        }

        // Attempt the transaction
        try {
          // Convert all BigInt values to hex strings recursively
          const convertedParams = KasKeeperConnector.convertBigIntToHex(txParams)

          // Use KasKeeper's actual transaction methods
          if (provider.sendL2Specailtx && convertedParams.data && convertedParams.data !== '0x') {
            // Contract interaction with data
            const amount = convertedParams.value ? parseInt(convertedParams.value, 16) : 0
            return await provider.sendL2Specailtx(convertedParams.to, amount, convertedParams.data)
          }

          if (provider.sendL2Kaspa) {
            // Simple value transfer
            const amount = convertedParams.value ? parseInt(convertedParams.value, 16) : 0
            return await provider.sendL2Kaspa(convertedParams.to, amount)
          }

          throw new Error('KasKeeper transaction methods not available')
        } catch (error) {
          throw new Error(`KasKeeper sendTransaction failed: ${error}. Sending ${txParams.value} to ${txParams.to}.`)
        }
      },
      signMessage: async ({ message }: { message: string }) => {
        return provider.signMessage(message)
      },
      signTransaction: async (transaction: any) => {
        // Convert BigInt values in transaction
        const convertedTransaction = KasKeeperConnector.convertBigIntToHex(transaction)

        // KasKeeper doesn't support direct transaction signing
        throw new Error(
          `KasKeeper does not support transaction signing for transaction to ${convertedTransaction.to}. Please use KasKeeper's native transaction interface.`,
        )
      },
      type: 'kasKeeper',
    } as unknown as WalletClient
  }

  async isAuthorized() {
    try {
      const provider = await this.getProvider()
      if (!provider) return false

      const accounts = await provider.getAccounts()
      return accounts && accounts.length > 0
    } catch {
      return false
    }
  }

  async switchChain(chainId: number): Promise<Chain> {
    // KasKeeper doesn't support standard chain switching
    // It has its own network switching with specific network names
    // Return the requested chain if it's supported
    const chain = this.chains?.find((c) => c.id === chainId)
    if (chain) {
      return chain
    }
    throw new Error('Chain switching not supported by KasKeeper - use switchNetwork method instead')
  }

  // Helper method to ensure we're on testnet
  private static async ensureTestnetNetwork(provider: KasKeeperProvider): Promise<void> {
    try {
      const currentNetwork = await provider.getNetwork()
      if (currentNetwork !== 'kaspa_testnet') {
        await provider.switchNetwork('kaspa_testnet')
        // Wait for network switch to complete
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Verify the switch was successful
        const finalNetwork = await provider.getNetwork()
        if (finalNetwork !== 'kaspa_testnet') {
          throw new Error(`Failed to switch to testnet. Current network: ${finalNetwork}`)
        }
      }
    } catch (error) {
      throw new Error(`Failed to ensure testnet network: ${error}`)
    }
  }

  // Helper method to ensure we're on Layer 2
  private static async ensureLayer2(provider: KasKeeperProvider, forceSwitch = false): Promise<void> {
    try {
      const currentLayer = await provider.getLayer()
      if (currentLayer !== 'L2' || forceSwitch) {
        await provider.switchLayer('L2')
        // Wait for layer switch to complete
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Verify the switch was successful
        const finalLayer = await provider.getLayer()
        if (finalLayer !== 'L2') {
          throw new Error(`Failed to switch to Layer 2. Current layer: ${finalLayer}`)
        }
      }
    } catch (error) {
      throw new Error(`Failed to ensure Layer 2: ${error}`)
    }
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit('disconnect')
      return
    }

    // Convert Kaspa address to Ethereum address
    const kaspaAddress = accounts[0]
    const ethAddress = KasKeeperConnector.kaspaToEthAddress(kaspaAddress)

    this.emit('change', {
      account: getAddress(ethAddress),
    })
  }

  protected onChainChanged = (_chainId: number | string) => {
    // KasKeeper doesn't use standard chain IDs
    this.emit('change', { chain: { id: 42161, unsupported: false } })
  }

  protected onDisconnect = () => {
    this.emit('disconnect')
  }

  protected onNetworkChanged = async (network: string) => {
    // KasKeeper uses network names like 'kaspa_testnet' / 'kaspa_mainnet'
    // Ensure we're always on testnet to get Ethereum-compatible addresses
    if (network !== 'kaspa_testnet') {
      try {
        const provider = await this.getProvider()
        if (provider) {
          await provider.switchNetwork('kaspa_testnet')
          // Also ensure we're on Layer 2
          await KasKeeperConnector.ensureLayer2(provider)

          // Wait for switches to complete
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Get the updated accounts
          const accounts = await provider.getAccounts()
          if (accounts && accounts.length > 0 && accounts[0].startsWith('0x')) {
            this.emit('change', {
              account: getAddress(accounts[0]),
              chain: { id: this.chains?.[0]?.id || 42161, unsupported: false },
            })
            return
          }
        }
      } catch (error) {
        console.warn('Failed to switch to testnet:', error)
      }
    }

    // Emit generic chain change event
    this.emit('change', { chain: { id: this.chains?.[0]?.id || 42161, unsupported: false } })
  }

  protected onLayerChanged = async (layer: string) => {
    // KasKeeper layer change (L1/L2)
    // Ensure we stay on Layer 2 by default
    if (layer !== 'L2') {
      try {
        const provider = await this.getProvider()
        if (provider) {
          // First ensure we're on testnet
          await KasKeeperConnector.ensureTestnetNetwork(provider)

          // Then switch to Layer 2
          await provider.switchLayer('L2')

          // Wait for the switch to complete
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Get the updated accounts (should be Ethereum addresses on L2)
          const accounts = await provider.getAccounts()
          if (accounts && accounts.length > 0 && accounts[0].startsWith('0x')) {
            this.emit('change', {
              account: getAddress(accounts[0]),
              chain: { id: this.chains?.[0]?.id || 42161, unsupported: false },
            })
            return
          }
        }
      } catch (error) {
        // Continue if switching fails
        console.warn('Failed to switch back to Layer 2:', error)
      }
    }

    // Emit change event with current chain
    this.emit('change', { chain: { id: this.chains?.[0]?.id || 42161, unsupported: false } })
  }

  protected static isUserRejectedRequestError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('rejected')
  }
}
