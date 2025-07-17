import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CardBody, Text, Flex, Box, Heading, FlexGap, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import dynamic from 'next/dynamic'

import { useFaucet } from '../../../hooks/useFaucet'
import {
  FaucetContainer,
  HeaderSection,
  ContentWrapper,
  FaucetIcon,
  MainCard,
  WarningCard,
  QueueStatusCard,
  FormContainer,
  InputContainer,
  StyledInput,
  ClaimButton,
  InfoList,
  InfoListItem,
  InfoIcon,
  TechnicalCard,
  CountdownText,
  ProgressContainer,
  ProgressBar,
  ErrorCard,
  TimerCard,
  TimerDisplay,
  TimeUnit,
  TimeValue,
  TimeLabel,
  StatusBadge,
  DismissButton,
} from './styled'

// Component interfaces
interface FormData {
  walletAddress: string
}
// Replace your ReCAPTCHA import with this dynamic import
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
  ssr: false, // Disable server-side rendering for reCAPTCHA
})
const KASFaucetCard: React.FC = () => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const [countdown, setCountdown] = useState(600)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState<boolean>(false)
  const [captchaKey, setCaptchaKey] = useState<number>(0) // For forcing captcha reset

  // Check if reCAPTCHA is enabled
  const isRecaptchaEnabled = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)

  // Use the existing faucet hook
  const {
    isLoading,
    error,
    claimStatus,
    claimTokens,
    fetchStatus,
    clearError,
    canClaim,
    cooldownRemaining,
    isPaused,
    queueSize,
    queueCapacity,
  } = useFaucet()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
  })

  const watchedAddress = watch('walletAddress')

  // Countdown timer effect for pause
  useEffect(() => {
    if (isPaused && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
    return undefined
  }, [isPaused, countdown])

  // Fetch status when address changes
  useEffect(() => {
    if (watchedAddress && watchedAddress.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(watchedAddress)) {
      fetchStatus(watchedAddress)
    }
  }, [watchedAddress, fetchStatus])

  // Set dummy token when reCAPTCHA is disabled
  useEffect(() => {
    if (!isRecaptchaEnabled) {
      setCaptchaToken('disabled')
    }
  }, [isRecaptchaEnabled])

  // Format claim timer
  const formatClaimTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: remainingSeconds.toString().padStart(2, '0'),
    }
  }

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    // Only require captcha if reCAPTCHA is enabled
    if (isRecaptchaEnabled && !captchaToken) {
      toastError(t('Please complete the reCAPTCHA verification'))
      return
    }

    try {
      // Only pass captcha token if reCAPTCHA is enabled and token exists
      const tokenToPass = isRecaptchaEnabled ? captchaToken : undefined
      await claimTokens(data.walletAddress, tokenToPass)
      toastSuccess(t('Claim request submitted successfully!'))
      reset()
      // Reset captcha after successful submission
      setCaptchaToken(null)
      setCaptchaError(false)
      setCaptchaKey((prev) => prev + 1) // Force captcha reset
    } catch (err) {
      toastError(t('Failed to submit claim request'))
      // Reset captcha on error so user can try again
      setCaptchaToken(null)
      setCaptchaError(false)
      setCaptchaKey((prev) => prev + 1) // Force captcha reset
    }
  }

  // Handle captcha verification
  const onCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
    setCaptchaError(false)
  }

  // Handle captcha expiry
  const onCaptchaExpire = () => {
    setCaptchaToken(null)
    setCaptchaError(false)
  }

  // Handle captcha error
  const onCaptchaError = (captchaErrorDetails?: any) => {
    setCaptchaToken(null)
    setCaptchaError(true)

    // Log error details for debugging
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('reCAPTCHA Error:', captchaErrorDetails)
    }

    // Show user-friendly error message
    let errorMessage = 'reCAPTCHA verification failed. Please try again.'

    // Handle different error types
    if (captchaErrorDetails) {
      if (typeof captchaErrorDetails === 'string') {
        if (captchaErrorDetails.includes('Invalid key') || captchaErrorDetails.includes('invalid-input-secret')) {
          errorMessage = 'reCAPTCHA configuration error. Please contact support.'
        } else if (captchaErrorDetails.includes('network') || captchaErrorDetails.includes('timeout')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        }
      } else if (typeof captchaErrorDetails === 'object' && captchaErrorDetails.error) {
        errorMessage = `reCAPTCHA error: ${captchaErrorDetails.error}`
      }
    } else {
      // Handle undefined/null errors - likely a configuration or loading issue
      errorMessage = 'reCAPTCHA failed to load. Please refresh the page and try again.'
    }

    toastError(t(errorMessage))

    // Auto-reset captcha after a short delay to allow user to retry
    setTimeout(() => {
      setCaptchaKey((prev) => prev + 1)
      setCaptchaError(false)
    }, 2000)
  }

  // Calculate queue progress percentage
  const queueProgress = queueCapacity > 0 ? (queueSize / queueCapacity) * 100 : 0
  // Determine current status
  const getCurrentStatus = () => {
    if (isLoading) return 'processing'
    if (error) return 'error'
    if (claimStatus?.hasClaimed && cooldownRemaining > 0) return 'cooldown'
    return 'available'
  }

  const getStatusText = () => {
    const status = getCurrentStatus()
    switch (status) {
      case 'processing':
        return t('Processing claim request...')
      case 'error':
        return t('Error occurred')
      case 'cooldown':
        return t('Cooldown active')
      case 'available':
      default:
        return t('Ready to claim')
    }
  }

  const getStatusIcon = () => {
    const status = getCurrentStatus()
    switch (status) {
      case 'processing':
        return '⏳'
      case 'error':
        return '❌'
      case 'cooldown':
        return '⏱️'
      case 'available':
      default:
        return '✅'
    }
  }

  // Check if claiming is allowed (note: using canClaim from hook instead)
  // const isClaimAllowed = !isLoading && !isPaused && !error && cooldownRemaining === 0 && isValid

  const timerDisplay = formatClaimTimer(cooldownRemaining)

  return (
    <FaucetContainer>
      {/* Header */}
      <HeaderSection>
        <FaucetIcon src="/TokenLogos/KAS.png" alt="KAS Token" />
        <Heading as="h1" size="xl" color="#ffffff" mb="8px">
          {t('KAS Faucet')}
        </Heading>
        <Text color="#ffffff" fontSize="18px">
          {t('Get 50 free KAS every 24 hours')}
        </Text>

        {/* Status Badge */}
        <Box mt="16px">
          <StatusBadge status={getCurrentStatus()}>
            <Text>{getStatusIcon()}</Text>
            <Text>{getStatusText()}</Text>
          </StatusBadge>
        </Box>
      </HeaderSection>

      <ContentWrapper>
        {/* Left Side - KAS Claiming Form */}
        <Box>
          {/* Error Display */}
          {error && (
            <ErrorCard severity={error.type === 'validation' ? 'warning' : 'error'}>
              <CardBody p="16px">
                <Flex alignItems="center" justifyContent="space-between" mb="8px">
                  <Flex alignItems="center">
                    <Text color={error.type === 'validation' ? '#ffc107' : '#ff6b6b'} mr="8px">
                      {error.type === 'validation' ? '⚠️' : '❌'}
                    </Text>
                    <Text color={error.type === 'validation' ? '#ffc107' : '#ff6b6b'} fontWeight="bold">
                      {error.type === 'validation' ? t('Validation Error') : t('Error')}
                    </Text>
                  </Flex>
                  <DismissButton onClick={clearError}>
                    <Text color="inherit">✕</Text>
                  </DismissButton>
                </Flex>
                <Text color={error.type === 'validation' ? '#ffc107' : '#ff6b6b'} fontSize="14px" mb="4px">
                  {error.message}
                </Text>
                {error.details && (
                  <Text
                    color={error.type === 'validation' ? '#ffc107' : '#ff6b6b'}
                    fontSize="12px"
                    style={{ opacity: 0.8 }}
                  >
                    {error.details}
                  </Text>
                )}
              </CardBody>
            </ErrorCard>
          )}

          {/* Main Card */}
          <MainCard>
            <CardBody p="24px">
              {/* System Pause Warning */}
              {isPaused && (
                <WarningCard variant="warning">
                  <CardBody p="16px">
                    <Flex alignItems="center" justifyContent="center" mb="8px">
                      <Text color="#ffc107" mr="8px">
                        ⏸️
                      </Text>
                      <Text color="#ffc107" fontWeight="bold">
                        {t('Service Paused')}
                      </Text>
                    </Flex>
                    <Text color="#ffc107" fontSize="14px" textAlign="center" mb="16px">
                      {t('The faucet is temporarily paused due to high demand. Please wait.')}
                    </Text>
                    <Flex flexDirection="column" alignItems="center">
                      <CountdownText>{countdown}</CountdownText>
                      <Text color="#ffc107" fontSize="12px">
                        {t('seconds remaining')}
                      </Text>
                    </Flex>
                  </CardBody>
                </WarningCard>
              )}

              {/* Rate Limit Warning */}
              {error?.type === 'rate_limit' && (
                <WarningCard variant="error">
                  <CardBody p="16px">
                    <Flex alignItems="center" justifyContent="center" mb="8px">
                      <Text color="#ff6b6b" mr="8px">
                        ⚠️
                      </Text>
                      <Text color="#ff6b6b" fontWeight="bold">
                        {t('Rate Limited')}
                      </Text>
                    </Flex>
                    <Text color="#ff6b6b" fontSize="14px" textAlign="center">
                      {error.message}
                    </Text>
                  </CardBody>
                </WarningCard>
              )}

              {/* Queue Status */}
              <QueueStatusCard>
                <CardBody p="16px">
                  <Flex alignItems="center" justifyContent="center" mb="8px">
                    <Text color="#ffffff" mr="8px">
                      👥
                    </Text>
                    <Text color="#ffffff" fontWeight="bold">
                      {t('Queue Status')}
                    </Text>
                  </Flex>
                  <Text color="#ffffff" fontSize="32px" fontWeight="bold" textAlign="center">
                    {queueSize}
                  </Text>
                  <Text color="#ffffff" fontSize="14px" textAlign="center" mb="16px">
                    {t('wallets in queue')}
                  </Text>
                  <ProgressContainer>
                    <ProgressBar width={queueProgress} />
                  </ProgressContainer>
                  <Text color="#ffffff" fontSize="12px" textAlign="center" mt="8px">
                    {t('Capacity')}: {queueCapacity}
                  </Text>
                </CardBody>
              </QueueStatusCard>

              {/* Wallet Input Form */}
              <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <InputContainer>
                  <Flex alignItems="center" mb="8px">
                    <Text color="#2efe87" mr="8px">
                      💼
                    </Text>
                    <Text color="#ffffff" fontWeight="500">
                      {t('Wallet Address')}
                    </Text>
                  </Flex>
                  <StyledInput
                    {...register('walletAddress', {
                      required: t('Wallet address is required'),
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/,
                        message: t('Must be a valid Ethereum address (42 characters)'),
                      },
                    })}
                    placeholder="0x1234567890abcdef..."
                    disabled={isLoading || isPaused}
                  />
                  {errors.walletAddress && (
                    <Text color="#ff6b6b" fontSize="12px">
                      {errors.walletAddress.message}
                    </Text>
                  )}
                  <Flex alignItems="center" mt="4px">
                    <Text color="#ffffff" fontSize="12px" mr="4px">
                      ℹ️
                    </Text>
                    <Text color="#ffffff" fontSize="12px">
                      {t('Must be a valid Ethereum address (42 characters)')}
                    </Text>
                  </Flex>
                </InputContainer>

                {/* Google reCAPTCHA verification */}
                <Flex justifyContent="center" mb="16px" flexDirection="column" alignItems="center">
                  {isRecaptchaEnabled && (
                    <Box mt="16px" mb="16px">
                      <ReCAPTCHA
                        key={captchaKey}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                        onChange={onCaptchaVerify}
                        onExpired={onCaptchaExpire}
                        onErrored={onCaptchaError}
                        theme="light"
                        size="normal"
                      />
                      {captchaError && (
                        <Text color="#ff6b6b" fontSize="12px" mt="8px">
                          {t('reCAPTCHA verification failed. Please try again.')}
                        </Text>
                      )}
                    </Box>
                  )}
                </Flex>

                <ClaimButton type="submit" disabled={!canClaim || (isRecaptchaEnabled && !captchaToken)} width="100%">
                  <Flex alignItems="center" justifyContent="center">
                    <Text mr="8px">🪙</Text>
                    <Text color="#ffffff" fontWeight="bold">
                      {isLoading ? t('Processing...') : t('Claim 50 KAS')}
                    </Text>
                  </Flex>
                </ClaimButton>
              </FormContainer>

              {/* Transaction History */}
              {claimStatus?.lastTransaction && (
                <WarningCard variant="success" style={{ marginTop: '24px' }}>
                  <CardBody p="16px">
                    <Flex alignItems="center" mb="8px">
                      <Text color="#2efe87" mr="8px">
                        ✅
                      </Text>
                      <Text color="#2efe87" fontWeight="bold">
                        {t('Transaction Sent')}
                      </Text>
                    </Flex>
                    <Text color="#2efe87" fontSize="14px" style={{ wordBreak: 'break-all' }}>
                      {claimStatus.lastTransaction}
                    </Text>
                  </CardBody>
                </WarningCard>
              )}
            </CardBody>
          </MainCard>
        </Box>

        {/* Right Side - Instructions */}
        <Box>
          {/* Claim Timer */}
          {claimStatus?.hasClaimed && cooldownRemaining > 0 && (
            <TimerCard>
              <CardBody p="20px">
                <Flex alignItems="center" justifyContent="center" mb="16px">
                  <Text color="#ffffff" mr="8px" fontSize="18px">
                    ⏱️
                  </Text>
                  <Text color="#ffffff" fontWeight="bold" fontSize="18px">
                    {t('Next Claim Available In')}
                  </Text>
                </Flex>
                <TimerDisplay>
                  <TimeUnit>
                    <TimeValue>{timerDisplay.hours}</TimeValue>
                    <TimeLabel>{t('Hours')}</TimeLabel>
                  </TimeUnit>
                  <Text color="#ffffff" fontSize="24px" fontWeight="bold">
                    :
                  </Text>
                  <TimeUnit>
                    <TimeValue>{timerDisplay.minutes}</TimeValue>
                    <TimeLabel>{t('Minutes')}</TimeLabel>
                  </TimeUnit>
                  <Text color="#ffffff" fontSize="24px" fontWeight="bold">
                    :
                  </Text>
                  <TimeUnit>
                    <TimeValue>{timerDisplay.seconds}</TimeValue>
                    <TimeLabel>{t('Seconds')}</TimeLabel>
                  </TimeUnit>
                </TimerDisplay>
                <Text color="#cbd5e0" fontSize="14px" textAlign="center">
                  {t('You can claim again once this timer reaches zero')}
                </Text>
              </CardBody>
            </TimerCard>
          )}
          {/* Enhanced Info Section */}
          <MainCard>
            <CardBody p="24px">
              <Flex alignItems="center" mb="20px">
                <Text color="#ffffff" mr="8px" fontSize="20px">
                  📖
                </Text>
                <Text color="#ffffff" fontSize="20px" fontWeight="bold">
                  {t('How to Use KAS Faucet')}
                </Text>
              </Flex>
              <InfoList>
                <InfoListItem>
                  <InfoIcon variant="success">1️⃣</InfoIcon>
                  <Text color="#ffffff" fontSize="14px">
                    {t('Enter a valid Ethereum address (42 characters starting with 0x)')}
                  </Text>
                </InfoListItem>
                <InfoListItem>
                  <InfoIcon variant="success">2️⃣</InfoIcon>
                  <Text color="#ffffff" fontSize="14px">
                    {t("Complete the reCAPTCHA verification to prove you're human")}
                  </Text>
                </InfoListItem>
                <InfoListItem>
                  <InfoIcon variant="success">3️⃣</InfoIcon>
                  <Text color="#ffffff" fontSize="14px">
                    {t('Your claim request will be queued for processing')}
                  </Text>
                </InfoListItem>
                <InfoListItem>
                  <InfoIcon variant="success">4️⃣</InfoIcon>
                  <Text color="#ffffff" fontSize="14px">
                    {t('Receive 50 KAS tokens directly to your wallet within minutes')}
                  </Text>
                </InfoListItem>
                <InfoListItem>
                  <InfoIcon variant="info">⏰</InfoIcon>
                  <Text color="#ffffff" fontSize="14px">
                    {t('Wait 24 hours before your next claim becomes available')}
                  </Text>
                </InfoListItem>
                <InfoListItem>
                  <InfoIcon variant="warning">⚠️</InfoIcon>
                  <Text color="#ffffff" fontSize="14px">
                    {t('Faucet automatically pauses for 10 minutes when queue reaches capacity')}
                  </Text>
                </InfoListItem>
              </InfoList>
            </CardBody>
          </MainCard>

          {/* Technical Details */}
          <TechnicalCard>
            <CardBody p="20px">
              <Flex alignItems="center" mb="14px" justifyContent="center">
                <Text color="#ffffff" mr="8px" fontSize="16px">
                  ⚙️
                </Text>
                <Text color="#ffffff" fontSize="16px" fontWeight="bold">
                  {t('Technical Information')}
                </Text>
              </Flex>
              <FlexGap gap="10px" flexDirection="column" alignItems="center">
                <Flex alignItems="center" flexWrap="wrap" justifyContent="center">
                  <Text color="#ffffff" fontSize="12px" mr="4px">
                    🌐
                  </Text>
                  <Text color="#ffffff" fontSize="12px" textAlign="center">
                    {t('Network')}:{' '}
                    <Text as="span" color="#2efe87" style={{ fontFamily: 'monospace' }}>
                      rpc.kasplextest.xyz
                    </Text>
                  </Text>
                </Flex>
                <Flex alignItems="center" flexWrap="wrap" justifyContent="center">
                  <Text color="#ffffff" fontSize="12px" mr="4px">
                    💰
                  </Text>
                  <Text color="#ffffff" fontSize="12px" textAlign="center">
                    {t('Amount')}:{' '}
                    <Text as="span" color="#2efe87">
                      50 KAS (50 × 10¹⁸ wei)
                    </Text>
                  </Text>
                </Flex>
                <Flex alignItems="center" flexWrap="wrap" justifyContent="center">
                  <Text color="#ffffff" fontSize="12px" mr="4px">
                    🚀
                  </Text>
                  <Text color="#ffffff" fontSize="12px" textAlign="center">
                    {t('Processing')}:{' '}
                    <Text as="span" color="#2efe87">
                      Automated Queue System
                    </Text>
                  </Text>
                </Flex>
              </FlexGap>
            </CardBody>
          </TechnicalCard>
        </Box>
      </ContentWrapper>
    </FaucetContainer>
  )
}

export default KASFaucetCard