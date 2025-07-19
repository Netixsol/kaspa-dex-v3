import { createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { promises as fs } from 'fs'
import path from 'path'
import { kasplexTestnet } from 'config/chains'

// Types
export interface ClaimRecord {
  address: string
  amount: string
  timestamp: number
  txHash?: string
  status: 'pending' | 'completed' | 'failed'
}

export interface FaucetData {
  claims: ClaimRecord[]
  queue: string[]
  systemStatus: {
    isPaused: boolean
    pauseUntil?: number
    queueCapacity: number
    rateLimitWindow: number // ms
    rateLimitRequests: number
  }
  rateLimits: Record<string, number[]> // address -> timestamps
}

export interface ClaimError {
  type: 'validation' | 'network' | 'contract' | 'rate_limit' | 'insufficient_funds' | 'unknown'
  message: string
  details?: string
}
// Configuration
export const FAUCET_CONFIG = {
  AMOUNT: '50', // 50 KAS
  COOLDOWN_HOURS: 24,
  QUEUE_CAPACITY: 30,
  RATE_LIMIT_WINDOW: 10 * 60 * 1000, // 10 minutes
  RATE_LIMIT_REQUESTS: 5,
  PAUSE_DURATION: 10 * 60 * 1000, // 10 minutes
  RPC_URL: process.env.KAS_RPC_URL || 'https://rpc.kasplextest.xyz',
  PRIVATE_KEY: process.env.FAUCET_PRIVATE_KEY,
  CHAIN_ID: 167012, // KAS testnet chain ID
  RECAPTCHA_SECRET: process.env.GOOGLE_CAPTCHA_SECRET_KEY,
}
// Define KAS chain for faucet (using direct RPC)
const kasChain = kasplexTestnet

// Data file path
// const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'kas-faucet.json')
const DATA_FILE_PATH = path.join('/tmp', 'kas-faucet.json')

// Initialize data file if it doesn't exist
export async function initializeDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE_PATH)
  } catch {
    // File doesn't exist, create it
    const dataDir = path.dirname(DATA_FILE_PATH)
    await fs.mkdir(dataDir, { recursive: true })

    const initialData: FaucetData = {
      claims: [],
      queue: [],
      systemStatus: {
        isPaused: false,
        queueCapacity: FAUCET_CONFIG.QUEUE_CAPACITY,
        rateLimitWindow: FAUCET_CONFIG.RATE_LIMIT_WINDOW,
        rateLimitRequests: FAUCET_CONFIG.RATE_LIMIT_REQUESTS,
      },
      rateLimits: {},
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(initialData, null, 2))
  }
}

// Read data from file
export async function readFaucetData(): Promise<FaucetData> {
  await initializeDataFile()
  const data = await fs.readFile(DATA_FILE_PATH, 'utf-8')
  return JSON.parse(data)
}

// Write data to file
export async function writeFaucetData(data: FaucetData): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2))
}

// Validate Ethereum address
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Check if address is in cooldown
export function isAddressInCooldown(
  claims: ClaimRecord[],
  address: string,
): { inCooldown: boolean; remainingTime: number } {
  const now = Date.now()
  const cooldownMs = FAUCET_CONFIG.COOLDOWN_HOURS * 60 * 60 * 1000

  // Find the most recent successful claim for this address
  const lastClaim = claims
    .filter((claim) => claim.address.toLowerCase() === address.toLowerCase() && claim.status === 'completed')
    .sort((a, b) => b.timestamp - a.timestamp)[0]

  if (!lastClaim) {
    return { inCooldown: false, remainingTime: 0 }
  }

  const timeSinceLastClaim = now - lastClaim.timestamp
  const remainingTime = Math.max(0, cooldownMs - timeSinceLastClaim)

  return {
    inCooldown: remainingTime > 0,
    remainingTime: Math.floor(remainingTime / 1000), // return in seconds
  }
}

// Check rate limit for an address
export function checkRateLimit(rateLimits: Record<string, number[]>, address: string): boolean {
  const now = Date.now()
  const windowStart = now - FAUCET_CONFIG.RATE_LIMIT_WINDOW

  if (!rateLimits[address]) {
    // eslint-disable-next-line no-param-reassign
    rateLimits[address] = []
  }

  // Remove old entries outside the window
  // eslint-disable-next-line no-param-reassign
  rateLimits[address] = rateLimits[address].filter((timestamp) => timestamp > windowStart)

  // Check if limit exceeded
  return rateLimits[address].length >= FAUCET_CONFIG.RATE_LIMIT_REQUESTS
}

// Add rate limit entry
export function addRateLimitEntry(rateLimits: Record<string, number[]>, address: string): void {
  const now = Date.now()
  if (!rateLimits[address]) {
    // eslint-disable-next-line no-param-reassign
    rateLimits[address] = []
  }
  rateLimits[address].push(now)
}

// Create wallet client for sending transactions
export function createFaucetWallet() {
  if (!FAUCET_CONFIG.PRIVATE_KEY) {
    throw new Error('FAUCET_PRIVATE_KEY environment variable is required')
  }

  const account = privateKeyToAccount(FAUCET_CONFIG.PRIVATE_KEY as `0x${string}`)

  return createWalletClient({
    account,
    chain: kasChain,
    transport: http(FAUCET_CONFIG.RPC_URL),
  })
}

// Send KAS tokens
export async function sendKASTokens(toAddress: string, amount: string): Promise<string> {
  try {
    const wallet = createFaucetWallet()

    const txHash = await wallet.sendTransaction({
      account: wallet.account,
      to: toAddress as `0x${string}`,
      value: parseEther(amount),
      chain: kasChain,
    })

    return txHash
  } catch (error) {
    console.error('Error sending KAS tokens:', error)
    throw error
  }
}

// Get wallet balance
export async function getFaucetBalance(): Promise<string> {
  try {
    const _wallet = createFaucetWallet()
    // Note: This is a simplified balance check. In a real implementation,
    // you'd want to check the actual balance from the blockchain
    return '1000' // Placeholder - implement actual balance checking
  } catch (error) {
    console.error('Error getting faucet balance:', error)
    return '0'
  }
}

// Clean up old data (optional maintenance function)
export async function cleanupOldData(): Promise<void> {
  const data = await readFaucetData()
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

  // Remove claims older than 7 days
  data.claims = data.claims.filter((claim) => claim.timestamp > sevenDaysAgo)

  // Clean up rate limits
  const windowStart = now - data.systemStatus.rateLimitWindow
  Object.keys(data.rateLimits).forEach((address) => {
    data.rateLimits[address] = data.rateLimits[address].filter((timestamp) => timestamp > windowStart)
    if (data.rateLimits[address].length === 0) {
      delete data.rateLimits[address]
    }
  })

  await writeFaucetData(data)
}

// Verify Google reCAPTCHA token
export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!FAUCET_CONFIG.RECAPTCHA_SECRET) {
    console.warn('Google reCAPTCHA secret key not configured, skipping verification')
    return true // Allow claims when captcha is not configured (for development)
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: FAUCET_CONFIG.RECAPTCHA_SECRET,
        response: token,
      }),
    })

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Error verifying Google reCAPTCHA:', error)
    return false
  }
}
