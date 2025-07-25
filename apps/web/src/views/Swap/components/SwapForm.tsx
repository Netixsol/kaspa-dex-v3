import dynamic from 'next/dynamic';
import { Trans, useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { ArrowBackIcon, Box, Button, CopyButton, Flex, FlexGap, Skeleton, Tab, Text } from '@pancakeswap/uikit'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { maxAmountSpend } from 'utils/maxAmountSpend'

import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow } from 'components/Layout/Row'
import { CommonBasesType } from 'components/SearchModal/types'

import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'

import { Field } from 'state/swap/actions'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { currencyId } from 'utils/currencyId'

import { CurrencyLogo } from '@pancakeswap/uikit/src/components/CurrencyLogo'
import { SwitchButton } from '@pancakeswap/uikit/src/widgets/Swap/SwapWidget'
import { useExpertMode, useUserSlippage } from '@pancakeswap/utils/user'
import AddToWalletButton from 'components/AddToWallet/AddToWalletButton'
// import HoverLottie from 'components/Menu/GlobalSettings/HoverLottie'

import useTokenInfo from 'hooks/useTokenInfo'
import styled from 'styled-components'
import { shortenAddress } from 'views/V3Info/utils'
import { formatLongNumber, formattedNum } from '../TokenInfo/swapUtils'
import useRefreshBlockNumberID from '../hooks/useRefreshBlockNumber'
import useWarningImport from '../hooks/useWarningImport'
import AddressInputPanel from './AddressInputPanel'
import AdvancedSwapDetailsDropdown from './AdvancedSwapDetailsDropdown'
import CurrencyInputHeader from './CurrencyInputHeader'
import SwapCommitButton from '../SwapCommitButton'
import { InfoRow, InfoRowLabel, InfoRowValue, TabContainer, TabText } from './infotokenStyles'
import animationsearch from './search.json'
import { Wrapper } from './styleds'

const HoverLottie = dynamic(() => import('components/Menu/GlobalSettings/HoverLottie'), { ssr: false });

export const ShowOnDesktop = styled.div`
  padding-top: 6px;
  position: none;
  @media (min-width: 468px) {
    position: relative;
  }
  @media (max-width: 467px) {
    position: none;
  }
`
export const ShowOnMobile = styled.div`
  position: none;
  @media (max-width: 468px) {
    position: none;
    display: flex;
    justify-content: center;
    padding-bottom: 5px;
  }
  @media (min-width: 467px) {
    position: absolute;
    left: 39.8%;
    top: -20%;
    z-index: 10;
  }
`

export const StyledWrapper = styled(Wrapper)`
  @media (min-width: 968px) {
    transform: scale(0.85);
    position: absolute;
    top: -42px;
  }
`

const StyledWrapperInfo = styled(Wrapper)`
  top: -9px;
  height: 100%;
  padding: 16px;

  /* Add the fade-in animation */
  animation: fade-in 0.5s ease-in-out;

  @media (min-width: 968px) {
    padding: 22px;

    transform: scale(0.85);
    position: absolute;
    min-height: 567px;
    /* max-width: 440px; */
    z-index: 10;
    top: -9%;
  }

  /* Define the fade-in animation */
  @keyframes fade-in {
    from {
      opacity: 0.1;
    }

    50% {
      opacity: 0.5;
    }

    to {
      opacity: 1;
    }
  }

  /* style={{
          minHeight: '567px',
          paddingBottom: '22px',
          zIndex: '10',
          position: 'absolute',
          top: '-09%',
          height: '100%',
        }} */
  /* @media (min-width: 968px) {
    transform: scale(0.85);
    position: absolute;
  } */
`
enum TAB {
  TOKEN_IN,
  TOKEN_OUT,
}
const NOT_AVAIALBLE = '--'

export default function SwapForm() {
  // const [inputValue, setInputValue] = useState('')
  // const inputRef = useRef(null)

  // const handleChange = (event) => {
  //   setInputValue(event.target.value)
  // }

  // const handleIconClick = () => {
  //   inputRef.current.focus()
  // }
  // const { isAccessTokenSupported } = useContext(SwapFeaturesContext)
  const { t } = useTranslation()
  const { refreshBlockNumber } = useRefreshBlockNumberID()
  // const stableFarms = useStableFarms()
  const warningSwapHandler = useWarningImport()

  const { account, chainId } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertMode()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippage()

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  // const hasStableSwapAlternative = useMemo(() => {
  //   return stableFarms.some((stableFarm) => {
  //     const checkSummedToken0 = isAddress(stableFarm?.token0.address)
  //     const checkSummedToken1 = isAddress(stableFarm?.token1.address)
  //     return (
  //       (checkSummedToken0 === inputCurrencyId || checkSummedToken0 === outputCurrencyId) &&
  //       (checkSummedToken1 === outputCurrencyId || checkSummedToken1 === outputCurrencyId)
  //     )
  //   })
  // }, [stableFarms, inputCurrencyId, outputCurrencyId])

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )

  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    inputError: swapInputError,
  } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, chainId)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, newCurrencyInput)

      warningSwapHandler(newCurrencyInput)

      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (newCurrencyOutput) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput)
      warningSwapHandler(newCurrencyOutput)

      const newCurrencyOutputId = currencyId(newCurrencyOutput)
      if (newCurrencyOutputId === inputCurrencyId) {
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
      }
      replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
    },

    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  const [info, setInfoState] = useState(true)

  return (
    <>
      {/* <InputWrapper>
        <SearchIcon onClick={handleIconClick}>
          <HoverLottie
            // onClick={onPresentSettingsModal}
            animationData={animationsearch}
            style={{
              width: '50px',
              cursor: 'pointer',
            }}
          />
        </SearchIcon>

        <InputField
          type="text"
          ref={inputRef}
          value={inputValue}
          placeholder="“Trying to type MRock to USDT”"
          onChange={handleChange}
        />
      </InputWrapper> */}
      {/* <AppBody> */}
      <StyledWrapper id="swap-page" style={{ background: '#252136', paddingBottom: '22px' }}>
        <AutoColumn gap="5.5px">
          <CurrencyInputHeader
            info={info}
            setInfoState={setInfoState}
            allowedSlippage={allowedSlippage}
            trade={trade}
            title={t('Swap')}
            subtitle={t('Trade tokens in an instant')}
            hasAmount={hasAmount}
            onRefreshPrice={onRefreshPrice}     />
          <CurrencyInputPanel
            showBUSD
            // backgroundColor="#2E3C56"
            label={independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton={!atMaxAmountInput}
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onPercentInput={handlePercentInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
            showCommonBases
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          />
          {/* {Arrow Switcher} */}
          <ShowOnDesktop>
            <ShowOnMobile>
              <SwitchButton
                onClick={() => {
                  setApprovalSubmitted(false) // reset 2 step UI for approvals
                  onSwitchTokens()
                  replaceBrowserHistory('inputCurrency', outputCurrencyId)
                  replaceBrowserHistory('outputCurrency', inputCurrencyId)
                }}
              />
            </ShowOnMobile>
            {/* {Arrow Switcher} */}
            <CurrencyInputPanel
              showBUSD
              // backgroundColor="#2E3C56"
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id="swap-currency-output"
              showCommonBases
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            />
          </ShowOnDesktop>

              {recipient === null && !showWrap && isExpertMode ? (
                <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                  <Text fontSize="14px" fontFamily="Inter" pb="1px" color="primary">
                    {t('+ Add a send (optional)')}
                  </Text>
                </Button>
              ) : null}

              {/* {isAccessTokenSupported && (
            <Box>
              <AccessRisk inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
            </Box>
          )} */}

              {isExpertMode && recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="center">
                    {/* <ArrowWrapper clickable={false}>
                  <ArrowDownIcon  />
                </ArrowWrapper> */}
                    <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      {t('- Remove send')}
                    </Button>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}
            </AutoColumn>
            <AdvancedSwapDetailsDropdown trade={trade} />
            {/* {showWrap ? null : (
            <SwapUI.Info
              price={
                Boolean(trade) && (
                  <>
                    <SwapUI.InfoLabel fontFamily="Inter">{t('Price')}</SwapUI.InfoLabel>
                    {isLoading ? (
                      <Skeleton width="100%" ml="8px" height="24px" />
                    ) : (
                      <SwapUI.TradePrice price={trade?.executionPrice} />
                    )}
                  </>
                )
              }
              allowedSlippage={allowedSlippage}
            />
          )} */}

            {!swapIsUnsupported ? (
              trade && <></>
            ) : (
              <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
            )}
            <Flex justifyContent="center" alignItems="center">
              <Box padding="0px 3px 3px 0px" mt={12} height={40} width="100%" px={10}>
                <SwapCommitButton
                  swapIsUnsupported={swapIsUnsupported}
                  account={account}
                  showWrap={showWrap}
                  wrapInputError={wrapInputError}
                  onWrap={onWrap}
                  wrapType={wrapType}
                  parsedIndepentFieldAmount={parsedAmounts[independentField]}
                  approval={approval}
                  approveCallback={approveCallback}
                  approvalSubmitted={approvalSubmitted}
                  currencies={currencies}
                  isExpertMode={isExpertMode}
                  trade={trade}
                  swapInputError={swapInputError}
                  currencyBalances={currencyBalances}
                  recipient={recipient}
                  allowedSlippage={allowedSlippage}
                  onUserInput={onUserInput}
                />
              </Box>
            </Flex>
          </StyledWrapper>
        </>
    //   )}

    //   {/* </AppBody> */}
  )
}

export const SeachIcon = () => {
  return (
    <div>
      <HoverLottie
        // onClick={onPresentSettingsModal}
        animationData={animationsearch}
        style={{
          width: '50px',
          cursor: 'pointer',
        }}
      />
    </div>
  )
}

const TokenInfo = ({ currencies, onBack, info }: any) => {
  const { chainId } = useActiveWeb3React()

  function showInfo() {
    onBack(!info)
  }

  const [activeTab, setActiveTab] = useState(TAB.TOKEN_IN)
  const inputToken = currencies[Field.INPUT]
  const outputToken = currencies[Field.OUTPUT]
  const selectedToken = activeTab === TAB.TOKEN_OUT ? outputToken : inputToken

  const { data: tokenInfo, loading } = useTokenInfo(selectedToken)

  // console.log('tokenInfo', tokenInfo)
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    inputToken?.address && setActiveTab(TAB.TOKEN_IN)
  }, [chainId, inputToken])

  const listData = [
    { label: 'Price', value: tokenInfo.price ? formattedNum(tokenInfo.price.toString(), true) : NOT_AVAIALBLE },
    {
      label: 'Trading Volume (24H)',
      value: tokenInfo.tradingVolume ? formatLongNumber(tokenInfo.tradingVolume.toString(), true) : NOT_AVAIALBLE,
    },
    {
      label: 'Market Cap Rank',
      value: tokenInfo.marketCapRank ? `#  ${tokenInfo.marketCapRank.toString()}` : NOT_AVAIALBLE,
    },
    {
      label: 'Market Cap',
      value: tokenInfo.marketCap ? formatLongNumber(tokenInfo.marketCap.toString(), true) : NOT_AVAIALBLE,
    },
    {
      label: 'All-Time High',
      value: tokenInfo.allTimeHigh ? formattedNum(tokenInfo.allTimeHigh.toString(), true) : NOT_AVAIALBLE,
    },
    {
      label: 'All-Time Low',
      value: tokenInfo.allTimeLow ? formattedNum(tokenInfo.allTimeLow.toString(), true) : NOT_AVAIALBLE,
    },
    {
      label: 'Circulating Supply',
      value: tokenInfo.circulatingSupply ? formatLongNumber(tokenInfo.circulatingSupply.toString()) : NOT_AVAIALBLE,
    },
    {
      label: 'Total Supply',
      value: tokenInfo.totalSupply ? formatLongNumber(tokenInfo.totalSupply.toString()) : NOT_AVAIALBLE,
    },
  ]

  const isActiveTokenIn = activeTab === TAB.TOKEN_IN
  const isActiveTokenOut = activeTab === TAB.TOKEN_OUT

  return (
    <>
      <StyledWrapperInfo
        id="swap-page-info"
        style={{
          backgroundColor: '#252136',
        }}
      >
        <FlexGap justifyContent="space-between" alignItems="center" width="100%">
          <FlexGap alignItems="center" gap="10px" justifyContent="space-between">
            <Button variant="text" px="0px" onClick={() => showInfo()}>
              <ArrowBackIcon />
              <Text fontFamily="Inter" fontSize={24} fontWeight={400} pl="20px">
                Info
              </Text>
            </Button>
          </FlexGap>
          <TabContainer>
            <Tab isActive={isActiveTokenIn} onClick={() => setActiveTab(TAB.TOKEN_IN)}>
              <CurrencyLogo currency={inputToken} size="24px" />
              <TabText isActive={isActiveTokenIn}>{inputToken?.symbol}</TabText>
            </Tab>
            <Tab isActive={isActiveTokenOut} onClick={() => setActiveTab(TAB.TOKEN_OUT)}>
              <CurrencyLogo currency={outputToken} size="24px" />
              <TabText isActive={isActiveTokenOut}>{outputToken?.symbol}</TabText>
            </Tab>
          </TabContainer>
        </FlexGap>

        {listData.map((item) => (
          <InfoRow key={item.label}>
            <InfoRowLabel>{item.label}</InfoRowLabel>
            <InfoRowValue>{loading ? '-' : item.value}</InfoRowValue>
          </InfoRow>
        ))}

        <InfoRow style={{ borderBottom: 'none', paddingBottom: 0, flexWrap: 'wrap', gap: '10px' }}>
          <InfoRowLabel>
            <Trans>Contract Address</Trans>
          </InfoRowLabel>

          <AutoRow width="fit-content" gap="4px" pb={['12px', '12px', null, null]} position="relative">
            {selectedToken ? (
              <FlexGap gap="10px" alignItems="center">
                <CurrencyLogo currency={selectedToken} size="24px" />
                {selectedToken?.address && <InfoRowValue>{shortenAddress(selectedToken?.address)}</InfoRowValue>}
                <CopyButton
                  marginLeft="5px"
                  text={selectedToken.address}
                  tooltipMessage="Address Copied"
                  tooltipTop={-20}
                />
                <AddToWalletButton
                  variant="text"
                  p="0"
                  height="auto"
                  width="fit-content"
                  tokenAddress={selectedToken?.address}
                  tokenSymbol={selectedToken.symbol}
                  tokenDecimals={selectedToken.decimals}
                  tokenLogo={selectedToken.logo}
                />
              </FlexGap>
            ) : (
              <Skeleton />
            )}
          </AutoRow>
        </InfoRow>
      </StyledWrapperInfo>
      {/* <PoweredByWrapper>
        <PoweredByText>
          <Trans>Powered by</Trans>
        </PoweredByText>{' '}
        <img src={darkMode ? Coingecko : CoingeckoLight} alt="Coingecko logo" />
      </PoweredByWrapper> */}
    </>
  )
}
