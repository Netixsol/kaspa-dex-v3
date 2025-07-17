import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { faucetsABI } from 'utils/Faucets/faucetsABI'
import { KAS_USDC_FAUCETS_ABI } from 'utils/Faucets/KAS_USDC_faucetsABI'
import {
  FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
  KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
} from 'config/constants/contracts'

// Hook to get faucet contract with ABI
export function useFaucetContract() {
  return {
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
  }
}

// Hook to check if user has claimed specific tokens
export function useUserClaimStatus() {
  const { address } = useAccount()

  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'getUserClaimStatus',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

// Hook to get claim amount
export function useClaimAmount() {
  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'CLAIM_AMOUNT',
    watch: true,
  })
}

// Hook to check if contract is paused
export function useIsFaucetPaused() {
  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'paused',
    watch: true,
  })
}

// Individual token claim status hooks
export function useHasClaimedUSDT() {
  const { address } = useAccount()

  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'hasClaimedUSDT',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

export function useHasClaimedKaspaFinance() {
  const { address } = useAccount()

  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'hasClaimedKaspaFinance',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

export function useHasClaimedBlokkplay() {
  const { address } = useAccount()

  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'hasClaimedBlokkplay',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

export function useHasClaimedFcN() {
  const { address } = useAccount()

  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'hasClaimedFcN',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

export function useHasClaimedGeM() {
  const { address } = useAccount()

  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'hasClaimedGeM',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

// Individual token claim status hooks for KAS/USDC faucet
export function useHasClaimedKAS() {
  const { address } = useAccount()

  return useContractRead({
    address: KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: KAS_USDC_FAUCETS_ABI,
    functionName: 'hasClaimedKAS',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

export function useHasClaimedUSDC() {
  const { address } = useAccount()

  return useContractRead({
    address: KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: KAS_USDC_FAUCETS_ABI,
    functionName: 'hasClaimedUSDC',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

// Token claim write hooks
export function useClaimUSDT() {
  const {
    data,
    write,
    isLoading: isWriteLoading,
    error,
  } = useContractWrite({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'claimUSDT',
  })

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    claimUSDT: write,
    data,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error,
    isEnabled: !!write,
  }
}

export function useClaimKaspaFinance() {
  const {
    data,
    write,
    isLoading: isWriteLoading,
    error,
  } = useContractWrite({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'claimKaspaFinance',
  })

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    claimKaspaFinance: write,
    data,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error,
    isEnabled: !!write,
  }
}

export function useClaimBlokkplay() {
  const {
    data,
    write,
    isLoading: isWriteLoading,
    error,
  } = useContractWrite({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'claimBlokkplay',
  })

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    claimBlokkplay: write,
    data,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error,
    isEnabled: !!write,
  }
}

export function useClaimFcN() {
  const {
    data,
    write,
    isLoading: isWriteLoading,
    error,
  } = useContractWrite({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'claimFcN',
  })

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    claimFcN: write,
    data,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error,
    isEnabled: !!write,
  }
}

export function useClaimGeM() {
  const {
    data,
    write,
    isLoading: isWriteLoading,
    error,
  } = useContractWrite({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'claimGeM',
  })

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    claimGeM: write,
    data,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error,
    isEnabled: !!write,
  }
}

// Token claim write hooks for KAS/USDC faucet
export function useClaimKAS() {
  const {
    data,
    write,
    isLoading: isWriteLoading,
    error,
  } = useContractWrite({
    address: KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: KAS_USDC_FAUCETS_ABI,
    functionName: 'claimKAS',
  })

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    claimKAS: write,
    data,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error,
    isEnabled: !!write,
  }
}

export function useClaimUSDC() {
  const {
    data,
    write,
    isLoading: isWriteLoading,
    error,
  } = useContractWrite({
    address: KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: KAS_USDC_FAUCETS_ABI,
    functionName: 'claimUSDC',
  })

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    claimUSDC: write,
    data,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error,
    isEnabled: !!write,
  }
}

// Combined hook for all claim functions
export function useFaucetClaims() {
  const usdtClaim = useClaimUSDT()
  const kaspaFinanceClaim = useClaimKaspaFinance()
  const blokkplayClaim = useClaimBlokkplay()
  const fcnClaim = useClaimFcN()
  const gemClaim = useClaimGeM()

  // KAS/USDC faucet claims
  const kasClaim = useClaimKAS()
  const usdcClaim = useClaimUSDC()

  return {
    USDT: usdtClaim,
    KFC: kaspaFinanceClaim, // KFC maps to KaspaFinance
    BLK: blokkplayClaim, // BLK maps to Blokkplay
    FCN: fcnClaim,
    GEM: gemClaim,
    KAS: kasClaim,
    USDC: usdcClaim,
  }
}

// Combined hook for all claim status checks
export function useFaucetClaimStatuses() {
  const usdtStatus = useHasClaimedUSDT()
  const kaspaFinanceStatus = useHasClaimedKaspaFinance()
  const blokkplayStatus = useHasClaimedBlokkplay()
  const fcnStatus = useHasClaimedFcN()
  const gemStatus = useHasClaimedGeM()
  const kasStatus = useHasClaimedKAS()
  const usdcStatus = useHasClaimedUSDC()

  return {
    USDT: usdtStatus,
    KFC: kaspaFinanceStatus, // KFC maps to KaspaFinance
    BLK: blokkplayStatus, // BLK maps to Blokkplay
    FCN: fcnStatus,
    GEM: gemStatus,
    KAS: kasStatus,
    USDC: usdcStatus,
  }
}

// Hook to get all contract balances (returns array of 5 uint256 values)
export function useContractBalances() {
  const { data } = useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'getContractBalances',
    watch: true,
  })

  // According to your smart contract, the array order should be:
  // [USDT, KaspaFinance, Blokkplay, FcN, GeM]
  const parseBalances = (balanceArray: any) => {
    if (!balanceArray || !Array.isArray(balanceArray)) {
      return {
        USDT: { data: null },
        KFC: { data: null },
        BLK: { data: null },
        FCN: { data: null },
        GEM: { data: null },
      }
    }

    return {
      USDT: { data: balanceArray[0] },
      BLK: { data: balanceArray[1] }, // BLK maps to Blokkplay
      FCN: { data: balanceArray[2] },
      GEM: { data: balanceArray[3] },
      KFC: { data: balanceArray[4] }, // KFC maps to KaspaFinance
    }
  }

  return parseBalances(data)
}

// Hook to get token status (which tokens are active)
export function useTokenStatus() {
  const { data } = useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'getTokenStatus',
    watch: true,
  })

  // Parse the boolean array [USDT, KaspaFinance, Blokkplay, FcN, GeM]
  const parseTokenStatus = (statusArray: any) => {
    if (!statusArray || !Array.isArray(statusArray)) {
      return {
        USDT: false,
        KFC: false,
        BLK: false,
        FCN: false,
        GEM: false,
      }
    }

    return {
      USDT: statusArray[0],
      KFC: statusArray[1], // KFC maps to KaspaFinance
      BLK: statusArray[2], // BLK maps to Blokkplay
      FCN: statusArray[3],
      GEM: statusArray[4],
    }
  }

  return parseTokenStatus(data)
}

// Hook to check if tokens are available (balance > claim amount AND token is active)
export function useTokenAvailability() {
  const balances = useContractBalances()
  const tokenStatus = useTokenStatus()
  const { data: claimAmount } = useClaimAmount()

  const checkAvailability = (balance: any, isActive: boolean) => {
    if (!balance?.data || !claimAmount || !isActive) return false
    return Number(balance.data) >= Number(claimAmount)
  }

  return {
    USDT: checkAvailability(balances.USDT, tokenStatus.USDT),
    KFC: checkAvailability(balances.KFC, tokenStatus.KFC),
    BLK: checkAvailability(balances.BLK, tokenStatus.BLK),
    FCN: checkAvailability(balances.FCN, tokenStatus.FCN),
    GEM: checkAvailability(balances.GEM, tokenStatus.GEM),
  }
}

// Hook to get claimable tokens for a user
export function useClaimableTokens() {
  const { address } = useAccount()

  return useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'getClaimableTokens',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  })
}

// Hook to get total claims for all tokens
export function useTotalClaims() {
  const { data } = useContractRead({
    address: FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: faucetsABI,
    functionName: 'getTotalClaims',
    watch: true,
  })

  // Parse the array [USDT, KaspaFinance, Blokkplay, FcN, GeM]
  const parseTotalClaims = (claimsArray: any) => {
    if (!claimsArray || !Array.isArray(claimsArray)) {
      return {
        USDT: 0,
        KFC: 0,
        BLK: 0,
        FCN: 0,
        GEM: 0,
      }
    }

    return {
      USDT: Number(claimsArray[0]),
      KFC: Number(claimsArray[1]), // KFC maps to KaspaFinance
      BLK: Number(claimsArray[2]), // BLK maps to Blokkplay
      FCN: Number(claimsArray[3]),
      GEM: Number(claimsArray[4]),
    }
  }

  return parseTotalClaims(data)
}

// Hooks for KAS/USDC faucet contract
export function useKasUsdcClaimAmounts() {
  const kasClaimAmount = useContractRead({
    address: KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: KAS_USDC_FAUCETS_ABI,
    functionName: 'KAS_CLAIM_AMOUNT',
    watch: true,
  })

  const usdcClaimAmount = useContractRead({
    address: KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: KAS_USDC_FAUCETS_ABI,
    functionName: 'USDC_CLAIM_AMOUNT',
    watch: true,
  })

  return {
    KAS: kasClaimAmount,
    USDC: usdcClaimAmount,
  }
}

export function useKasUsdcContractBalances() {
  const { data } = useContractRead({
    address: KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: KAS_USDC_FAUCETS_ABI,
    functionName: 'getContractBalances',
    watch: true,
  })

  // Parse the balance array [KAS, USDC]
  const parseBalances = (balanceArray: any) => {
    if (!balanceArray || !Array.isArray(balanceArray)) {
      return {
        KAS: { data: null },
        USDC: { data: null },
      }
    }

    return {
      KAS: { data: balanceArray[0] },
      USDC: { data: balanceArray[1] },
    }
  }

  return parseBalances(data)
}

export function useIsKasUsdcFaucetPaused() {
  return useContractRead({
    address: KAS_USDC_FAUCET_CONTRACT_ADDRESS_KASPLEX_TESTNET,
    abi: KAS_USDC_FAUCETS_ABI,
    functionName: 'paused',
    watch: true,
  })
}