import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Text, Button, Card, CardBody, Flex, useToast, Box } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import { kasplexTokensListForUI } from '@pancakeswap/tokens'
import { useAccount } from 'wagmi'
import {
    useFaucetClaims,
    useFaucetClaimStatuses,
    useClaimAmount,
    useIsFaucetPaused,
    useContractBalances,
    useTokenAvailability,
    useKasUsdcContractBalances,
    useKasUsdcClaimAmounts,
    useIsKasUsdcFaucetPaused,
} from 'hooks/useFaucetContract'
// import { SimpleTooltip } from '@pancakeswap/uikit/src/components/SimpleTooltip'
import KASFaucetCard from './components/KASFaucetsCard'
import { ASSET_CDN } from 'config/constants/endpoints'

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  /* Add top padding to avoid navbar overlap */
  padding-top: clamp(80px, 10vh, 120px);

  @media screen and (max-width: 968px) {
    padding-top: 90px;
    padding-left: 16px;
    padding-right: 16px;
  }

  @media screen and (max-width: 480px) {
    padding-top: 80px;
  }
`

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  margin-top: 20px; /* Add some extra space from the top */
`

const TokenCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 32px;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

const TokenCard = styled(Card)`
  background: #1b2053;
  border-radius: 20px;
  padding: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(46, 254, 135, 0.1);
  }
`

const TokenCardBody = styled(CardBody)`
  padding: 20px;
`

const TokenHeader = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const TokenIconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2efe87 0%, #1e7c47 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #120f1f;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 16px;
`

const TokenName = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 2px;
`

const TokenSymbol = styled(Text)`
  font-size: 14px;
  color: #8287bc;
  text-transform: uppercase;

  &.supported {
    color: #2efe87;
  }

  &.unsupported {
    color: #ff6b6b;
  }
`

const TokenAddress = styled(Text)`
  font-size: 12px;
  color: #ffffff;
  word-break: break-all;
  margin-top: 8px;
`

const AddressContainer = styled(Flex)`
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`

const CopyButtonStyled = styled.button`
  background: rgba(46, 254, 135, 0.1);
  border: 1px solid rgba(46, 254, 135, 0.3);
  border-radius: 6px;
  color: #2efe87;
  padding: 4px 8px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(46, 254, 135, 0.2);
    border-color: rgba(46, 254, 135, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`

const ClaimButton = styled(Button)`
  background: linear-gradient(135deg, #2efe87 0%, #1e7c47 100%);
  border: none;
  color: #120f1f;
  font-weight: bold;
  width: 100%;
  height: 40px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #26d16f 0%, #1a6b3d 100%);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #414066;
    color: #8287bc;
    cursor: not-allowed;
    transform: none;
  }

  /* Special styling for unsupported tokens */
  &.coming-soon {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: #d1d5db;
    position: relative;

    &::after {
      content: '🔒';
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
    }
  }
`

const ClaimInfo = styled.div`
  background: rgba(46, 254, 135, 0.1);
  border: 1px solid rgba(46, 254, 135, 0.2);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 20px;
`

export const FaucetsPage = () => {
    const { t } = useTranslation()
    const { toastSuccess, toastError, toastInfo } = useToast()
    const { isConnected } = useAccount()

    // Wagmi hooks for faucet contracts
    const faucetClaims = useFaucetClaims()
    const claimStatuses = useFaucetClaimStatuses()
    const { data: claimAmount } = useClaimAmount()
    const { data: isPaused } = useIsFaucetPaused()
    const contractBalances = useContractBalances()
    const tokenAvailability = useTokenAvailability()

    // KAS/USDC faucet hooks
    const kasUsdcBalances = useKasUsdcContractBalances()
    const kasUsdcClaimAmounts = useKasUsdcClaimAmounts()
    const { data: isKasUsdcPaused } = useIsKasUsdcFaucetPaused()

    // console.log('faucetClaims', faucetClaims)

    // Define which tokens are supported by the faucet contracts
    const supportedTokens = useMemo(() => ['USDT', 'KFC', 'BLK', 'FCN', 'GEM', 'USDC'], [])

    // Memoize the token claim mapping to prevent unnecessary re-renders
    const tokenClaimMapping = useMemo(
        () => ({
            USDT: {
                claimFn: faucetClaims.USDT,
                status: claimStatuses.USDT,
                balance: contractBalances.USDT,
                isAvailable: tokenAvailability.USDT,
            },
            KFC: {
                claimFn: faucetClaims.KFC, // KFC maps to KaspaFinance in contract
                status: claimStatuses.KFC,
                balance: contractBalances.KFC,
                isAvailable: tokenAvailability.KFC,
            },
            BLK: {
                claimFn: faucetClaims.BLK,
                status: claimStatuses.BLK,
                balance: contractBalances.BLK,
                isAvailable: tokenAvailability.BLK,
            },
            FCN: {
                claimFn: faucetClaims.FCN,
                status: claimStatuses.FCN,
                balance: contractBalances.FCN,
                isAvailable: tokenAvailability.FCN,
            },
            GEM: {
                claimFn: faucetClaims.GEM,
                status: claimStatuses.GEM,
                balance: contractBalances.GEM,
                isAvailable: tokenAvailability.GEM,
            },
            USDC: {
                claimFn: faucetClaims.USDC,
                status: claimStatuses.USDC,
                balance: kasUsdcBalances.USDC,
                isAvailable:
                    kasUsdcBalances.USDC?.data && kasUsdcClaimAmounts.USDC?.data
                        ? Number(kasUsdcBalances.USDC.data) >= Number(kasUsdcClaimAmounts.USDC.data)
                        : true,
            },
        }),
        [faucetClaims, claimStatuses, contractBalances, tokenAvailability, kasUsdcBalances, kasUsdcClaimAmounts],
    )

    const formatBalance = (balance: any, decimals = 18) => {
        if (!balance?.data) return '0'
        const formatted = Number(balance.data) / 10 ** decimals
        return formatted.toLocaleString(undefined, { maximumFractionDigits: 0 })
    }

    const handleClaimToken = useCallback(
        async (tokenKey: string, tokenSymbol: string) => {
            if (!isConnected) {
                toastError(t('Error'), t('Please connect your wallet to Kasplex testnet first'))
                return
            }

            // Check if the appropriate faucet is paused
            const isCurrentFaucetPaused = ['USDC'].includes(tokenSymbol) ? isKasUsdcPaused : isPaused
            if (isCurrentFaucetPaused) {
                toastError(t('Error'), t('Faucet is currently paused'))
                return
            }

            if (!supportedTokens.includes(tokenSymbol)) {
                toastError(t('Error'), t('%symbol% faucet is not available yet', { symbol: tokenSymbol }))
                return
            }

            const mapping = tokenClaimMapping[tokenSymbol]
            if (!mapping) {
                toastError(t('Error'), t('This token is not available for claiming'))
                return
            }

            // Check if contract has sufficient balance
            if (!mapping.isAvailable) {
                const currentBalance = formatBalance(mapping.balance)
                const requiredAmount = claimAmount ? formatBalance({ data: claimAmount }) : '5,000'

                toastError(
                    t('Insufficient Balance'),
                    t('Contract has insufficient %symbol% tokens. Available: %available%, Required: %required%', {
                        symbol: tokenSymbol,
                        available: currentBalance,
                        required: requiredAmount,
                    }),
                )
                return
            }

            // Check if user has already claimed this token
            if (mapping.status?.data) {
                toastError(t('Error'), t('You have already claimed %symbol% tokens', { symbol: tokenSymbol }))
                return
            }

            // Check if there's already an error state from the hook
            if (mapping.claimFn?.error) {
                console.error('Contract error for', tokenSymbol, ':', mapping.claimFn.error)

                let errorMessage = 'Unknown error occurred'
                const errorStr = mapping.claimFn.error?.message || mapping.claimFn.error?.toString() || ''

                if (errorStr.includes('Insufficient')) {
                    errorMessage = 'Faucet is out of tokens. Please contact admin to refill.'
                } else if (errorStr.includes('Already claimed')) {
                    errorMessage = 'You have already claimed this token'
                } else if (errorStr.includes('Paused')) {
                    errorMessage = 'Faucet is currently paused'
                } else if (errorStr.includes('rejected')) {
                    errorMessage = 'Transaction was rejected by user'
                } else if (errorStr.includes('revert')) {
                    errorMessage = 'Contract execution failed'
                } else if (mapping.claimFn.error?.message) {
                    errorMessage = mapping.claimFn.error.message
                }

                toastError(
                    t('Error'),
                    t('Cannot claim %symbol%: %error%', {
                        symbol: tokenSymbol,
                        error: errorMessage,
                    }),
                )
                return
            }

            // console.log('Token mapping for', tokenSymbol, ':', mapping)
            // console.log('Claim function object:', mapping.claimFn)

            try {
                let claimFunction
                switch (tokenSymbol) {
                    case 'USDT':
                        claimFunction = mapping.claimFn?.claimUSDT
                        break
                    case 'KFC':
                        claimFunction = mapping.claimFn?.claimKaspaFinance
                        break
                    case 'BLK':
                        claimFunction = mapping.claimFn?.claimBlokkplay
                        break
                    case 'FCN':
                        claimFunction = mapping.claimFn?.claimFcN
                        break
                    case 'GEM':
                        claimFunction = mapping.claimFn?.claimGeM
                        break
                    case 'USDC':
                        claimFunction = mapping.claimFn?.claimUSDC
                        break
                    default:
                        toastError(t('Error'), t('This token is not supported'))
                        return
                }

                // console.log('Claim function for', tokenSymbol, ':', claimFunction)
                // console.log('Is enabled:', mapping.claimFn?.isEnabled)

                if (!claimFunction) {
                    toastError(t('Error'), t('Claim function not available. Please check your wallet connection.'))
                    return
                }

                if (!mapping.claimFn?.isEnabled) {
                    toastError(t('Error'), t('Transaction not ready. Please wait a moment and try again.'))
                    return
                }

                // console.log('Attempting to call claim function for', tokenSymbol)

                // Call the function
                claimFunction()

                // Wait a moment for the transaction to be initiated
                await new Promise((resolve) => setTimeout(resolve, 1000))

                // Check for errors after attempting the transaction
                if (mapping.claimFn?.error) {
                    throw new Error(mapping.claimFn.error?.message || 'Transaction failed')
                }

                // Only show success if there's actually transaction data or success state
                if (mapping.claimFn?.data || mapping.claimFn?.isSuccess) {
                    let amount = 5000 // Default fallback

                    // Get the appropriate claim amount based on token
                    if (tokenSymbol === 'USDC' && kasUsdcClaimAmounts.USDC?.data) {
                        amount = Number(kasUsdcClaimAmounts.USDC.data) / 1e18
                    } else if (claimAmount) {
                        amount = Number(claimAmount) / 1e18
                    }

                    toastSuccess(
                        t('Success!'),
                        t('Transaction submitted! You will receive %amount% %symbol% tokens on Kasplex testnet.', {
                            amount: amount.toLocaleString(),
                            symbol: tokenSymbol,
                        }),
                    )
                } else {
                    // If no data and no error, it might still be processing
                    toastInfo(
                        t('Transaction Submitted'),
                        t('Your %symbol% claim transaction has been submitted. Please check your wallet for confirmation.', {
                            symbol: tokenSymbol,
                        }),
                    )
                }
            } catch (error: any) {
                console.error('Claim error for', tokenSymbol, ':', error)
                let errorMessage = 'Unknown error occurred'

                if (error?.message?.includes('Insufficient')) {
                    errorMessage = 'Faucet is out of tokens. Please contact admin.'
                } else if (error?.message?.includes('rejected')) {
                    errorMessage = 'Transaction was rejected'
                } else if (error?.message?.includes('Already claimed')) {
                    errorMessage = 'You have already claimed this token'
                } else if (error?.message?.includes('User rejected')) {
                    errorMessage = 'Transaction was cancelled'
                } else if (error?.message?.includes('execution reverted')) {
                    errorMessage = 'Contract execution failed. Please try again.'
                } else if (error?.message) {
                    errorMessage = error.message
                }

                toastError(
                    t('Error'),
                    t('Failed to claim %symbol% tokens: %error%', {
                        symbol: tokenSymbol,
                        error: errorMessage,
                    }),
                )
            }
        },
        [
            t,
            toastError,
            toastSuccess,
            toastInfo,
            isConnected,
            isPaused,
            isKasUsdcPaused,
            tokenClaimMapping,
            claimAmount,
            kasUsdcClaimAmounts,
            supportedTokens,
        ],
    )

    const handleCopyAddress = useCallback(
        async (address: string) => {
            try {
                await navigator.clipboard.writeText(address)
                toastSuccess(t('Copied!'), t('Contract address copied to clipboard'))
            } catch (error) {
                toastError(t('Error'), t('Failed to copy address'))
            }
        },
        [toastSuccess, toastError, t],
    )

    const getTokenIcon = (symbol: string) => {
        const logoPath = `${ASSET_CDN}/images/chains/${symbol.toLowerCase()}.png`
        return logoPath
    }

    const getClaimButtonText = (tokenSymbol: string, mapping: any) => {
        if (!isConnected) return t('Connect Wallet')
        if (!supportedTokens.includes(tokenSymbol)) return t('Coming Soon')
        if (!mapping?.isAvailable) return t('Out of Stock')
        if (mapping?.status?.data) return t('Already Claimed')
        const isCurrentFaucetPaused = ['USDC'].includes(tokenSymbol) ? isKasUsdcPaused : isPaused
        if (isCurrentFaucetPaused) return t('Paused')
        if (mapping?.claimFn?.isLoading) return t('Claiming...')
        return t('Claim Tokens')
    }
    const getClaimButtonTextForTooltip = (tokenSymbol: string, mapping: any) => {
        if (!isConnected) return t('Connect Wallet')
        if (!supportedTokens.includes(tokenSymbol)) return t('Will be available to clain soon')
        if (!mapping?.isAvailable) return t('Out of Stock')
        if (mapping?.status?.data) return t('Already Claimed')
        const isCurrentFaucetPaused = ['USDC'].includes(tokenSymbol) ? isKasUsdcPaused : isPaused
        if (isCurrentFaucetPaused) return t('Claiming is paused for now')
        if (mapping?.claimFn?.isLoading) return t('Claiming...')
        return t('Click to Claim')
    }

    const isClaimButtonDisabled = (tokenSymbol: string, mapping: any) => {
        if (!isConnected) return true
        if (!supportedTokens.includes(tokenSymbol)) return true
        if (!mapping?.isAvailable) return true // Out of stock
        const isCurrentFaucetPaused = ['USDC'].includes(tokenSymbol) ? isKasUsdcPaused : isPaused
        if (isCurrentFaucetPaused) return true
        if (mapping?.status?.data) return true // Already claimed
        if (mapping?.claimFn?.isLoading) return true // Currently claiming
        if (!mapping?.claimFn?.isEnabled) return true // Function not ready
        return false
    }

    return (
        <Page>
            <PageContainer>
                {/* KAS Faucet Card */}
                <Box style={{ marginBottom: '48px', display: 'flex', justifyContent: 'center' }}>
                    <KASFaucetCard />
                </Box>

                <HeaderSection>
                    <Text fontSize="32px" bold color="#ffffff" mb="16px">
                        {t('Token Faucets')}
                    </Text>
                    <Text fontSize="16px" color="#8287bc" textAlign="center" maxWidth="600px" margin="0 auto">
                        {t(
                            'Claim test tokens for development and testing on Kasplex testnet. Each wallet can claim tokens once per token type.',
                        )}
                    </Text>
                </HeaderSection>

                <ClaimInfo>
                    <Text fontSize="14px" color="#2efe87" textAlign="center">
                        💧 {t('Claim amounts vary by token')} • {t('One claim per wallet per token')} • {t('Kasplex testnet only')}
                    </Text>
                </ClaimInfo>

                <TokenCardsContainer>
                    {Object.entries(kasplexTokensListForUI).map(([tokenKey, token]) => {
                        const isSupported = supportedTokens.includes(token.symbol)
                        const mapping = tokenClaimMapping[token.symbol]
                        const hasClaimed = mapping?.status?.data || false

                        return (
                            <TokenCard key={tokenKey}>
                                <TokenCardBody>
                                    <TokenHeader>
                                        <Flex alignItems="center" flex="1">
                                            <TokenIconContainer>
                                                <img
                                                    src={getTokenIcon(token.address)}
                                                    alt={token.symbol}
                                                    onError={(e) => {
                                                        // eslint-disable-next-line no-param-reassign
                                                        e.currentTarget.style.display = 'none'
                                                            // eslint-disable-next-line no-param-reassign
                                                            ; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        display: 'none',
                                                        width: '100%',
                                                        height: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        color: '#120f1f',
                                                    }}
                                                >
                                                    {token.symbol.slice(0, 2)}
                                                </div>
                                            </TokenIconContainer>
                                            <TokenInfo>
                                                <TokenName>{token.name}</TokenName>
                                                <TokenSymbol className={isSupported ? 'supported' : 'unsupported'}>{token.symbol}</TokenSymbol>
                                                {!isSupported && (
                                                    <Text fontSize="10px" color="#ff6b6b" mt="2px">
                                                        {t('Faucet coming soon')}
                                                    </Text>
                                                )}
                                                {isSupported && hasClaimed && (
                                                    <Text fontSize="10px" color="#2efe87" mt="2px">
                                                        ✓ {t('Claimed')}
                                                    </Text>
                                                )}
                                                {isSupported && !hasClaimed && (
                                                    // <BalanceIndicator isAvailable={mapping?.isAvailable || false}>
                                                    //     {mapping?.isAvailable ? '🟢' : '🔴'}
                                                    //     {t('Balance: %balance%', {
                                                    //         balance: formatBalance(mapping?.balance)
                                                    //     })}
                                                    // </BalanceIndicator>
                                                    <Text fontSize="10px" color="#2efe87" mt="2px">
                                                        ✓ {t('Unclaimed')}
                                                    </Text>
                                                )}
                                            </TokenInfo>
                                        </Flex>
                                    </TokenHeader>

                                    <AddressContainer>
                                        {/* <SimpleTooltip
                                            text={
                                                <span
                                                    style={{
                                                        maxWidth: 320,
                                                        wordBreak: 'break-all',
                                                        whiteSpace: 'pre-line',
                                                        display: 'block',
                                                    }}
                                                >
                                                    {token.address}
                                                </span>
                                            }
                                            height="100%"
                                            placement="top"
                                        > */}
                                            <TokenAddress>{`${token.address.slice(0, 6)}...${token.address.slice(-4)}`}</TokenAddress>
                                        {/* </SimpleTooltip> */}
                                        <CopyButtonStyled
                                            onClick={() => handleCopyAddress(token.address)}
                                            title={t('Copy full address')}
                                        >
                                            {t('Copy')}
                                        </CopyButtonStyled>

                                    </AddressContainer>

                                    {/* Claim amount info - consistent spacing for all tokens */}
                                    <Text fontSize="12px" color="#ffffff" mt="8px" style={{ minHeight: '18px' }}>
                                        {['USDC'].includes(token.symbol)
                                            ? t('Each claim provides 50 tokens')
                                            : t('Each claim provides 5,000 tokens')}
                                    </Text>
                                    {/* <SimpleTooltip text={t(getClaimButtonTextForTooltip(token.symbol, mapping))} placement="top"> */}
                                        <ClaimButton
                                            onClick={() => handleClaimToken(tokenKey, token.symbol)}
                                            disabled={isClaimButtonDisabled(token.symbol, mapping)}
                                            className={!isSupported ? 'coming-soon' : ''}
                                            style={{
                                                marginTop: '16px',
                                                opacity: isSupported && mapping?.isAvailable ? 1 : 0.6,
                                            }}
                                        >
                                            {getClaimButtonText(token.symbol, mapping)}
                                        </ClaimButton>
                                    {/* </SimpleTooltip> */}
                                </TokenCardBody>
                            </TokenCard>
                        )
                    })}
                </TokenCardsContainer>
            </PageContainer>
        </Page>
    )
}