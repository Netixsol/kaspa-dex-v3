/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, validateAndParseAddress } from '@pancakeswap/sdk'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { useWeb3React } from 'hooks/useWeb3React'
import { ReactNode, useCallback, useMemo } from 'react'

import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { CommonBasesType } from 'components/SearchModal/types'
import { useCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { currencyId } from 'utils/currencyId'
import { maxAmountSpend } from 'utils/maxAmountSpend'

import { Box, FlexGap } from '@pancakeswap/uikit'
import { ShowOnDesktop, ShowOnMobile } from 'views/Swap/components/SwapForm'
import useWarningImport from '../../hooks/useWarningImport'
import {} from '../components'
import { useIsWrapping } from '../hooks'
import { FlipButton } from './FlipButton'
import { Recipient } from './Recipient'
import { RiskCheck } from './RiskCheck'

interface Props {
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeLoading?: boolean
  pricingAndSlippage?: ReactNode
  swapCommitButton?: ReactNode
  trade: any
  deteils?: ReactNode
}

export function FormMain({
  deteils,
  trade,
  pricingAndSlippage,
  inputAmount,
  outputAmount,
  tradeLoading,
  swapCommitButton,
}: Props) {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const warningSwapHandler = useWarningImport()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const isWrapping = useIsWrapping()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])
  const loadedUrlParams = useDefaultsFromURLSearch()

  const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  const handleTypeOutput = useCallback((value: string) => onUserInput(Field.OUTPUT, value), [onUserInput])

  const handlePercentInput = useCallback(
    (percent: number) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleCurrencySelect = useCallback(
    (newCurrency: Currency, field: Field, currentInputCurrencyId: string, currentOutputCurrencyId: string) => {
      onCurrencySelection(field, newCurrency)

      warningSwapHandler(newCurrency)

      const isInput = field === Field.INPUT
      const oldCurrencyId = isInput ? currentInputCurrencyId : currentOutputCurrencyId
      const otherCurrencyId = isInput ? currentOutputCurrencyId : currentInputCurrencyId
      const newCurrencyId = currencyId(newCurrency)
      if (newCurrencyId === otherCurrencyId) {
        replaceBrowserHistory(isInput ? 'outputCurrency' : 'inputCurrency', oldCurrencyId)
      }
      replaceBrowserHistory(isInput ? 'inputCurrency' : 'outputCurrency', newCurrencyId)
    },
    [onCurrencySelection, warningSwapHandler],
  )
  const handleInputSelect = useCallback(
    (newCurrency: Currency) => handleCurrencySelect(newCurrency, Field.INPUT, inputCurrencyId, outputCurrencyId),
    [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  )
  const handleOutputSelect = useCallback(
    // console.log('handleOutputSelect', newCurrency),
    (newCurrency: Currency) => handleCurrencySelect(newCurrency, Field.OUTPUT, inputCurrencyId, outputCurrencyId),
    [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  )

  const isTypingInput = independentField === Field.INPUT
  const inputValue = useMemo(
    () => typedValue && (isTypingInput ? typedValue : formatAmount(inputAmount) || ''),
    [typedValue, isTypingInput, inputAmount],
  )
  const outputValue = useMemo(
    () => typedValue && (isTypingInput ? formatAmount(outputAmount) || '' : typedValue),
    [typedValue, isTypingInput, outputAmount],
  )
  const inputLoading = typedValue ? !isTypingInput && tradeLoading : false
  const outputLoading = typedValue ? isTypingInput && tradeLoading : false

  return (
    <FlexGap flexDirection="column">
      <CurrencyInputPanel
        id="swap-currency-input"
        showUSDPrice
        showMaxButton
        showCommonBases
        inputLoading={!isWrapping && inputLoading}
        currencyLoading={!loadedUrlParams}
        label={!isTypingInput && !isWrapping ? t('From (estimated)') : t('From')}
        value={isWrapping ? typedValue : inputValue}
        maxAmount={maxAmountInput}
        showQuickInputButton={false}
        currency={inputCurrency}
        onUserInput={handleTypeInput}
        onPercentInput={handlePercentInput}
        onMax={handleMaxInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={outputCurrency}
        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
      />
      <RiskCheck currency={inputCurrency} />
      <ShowOnDesktop>
        <ShowOnMobile>
          <FlipButton />
        </ShowOnMobile>
        <CurrencyInputPanel
          id="swap-currency-output"
          showUSDPrice
          showCommonBases
          showMaxButton={false}
          inputLoading={!isWrapping && outputLoading}
          currencyLoading={!loadedUrlParams}
          label={isTypingInput && !isWrapping ? t('To (estimated)') : t('To')}
          value={isWrapping ? typedValue : outputValue}
          currency={outputCurrency}
          onUserInput={handleTypeOutput}
          onCurrencySelect={handleOutputSelect}
          otherCurrency={outputCurrency}
          commonBasesType={CommonBasesType.SWAP_LIMITORDER}
        />
      </ShowOnDesktop>
      <RiskCheck currency={outputCurrency} />
      <Recipient />

      {deteils}
      {pricingAndSlippage}
      {/* <AdvancedSwapDetailsDropdown trade={trade} /> */}

      <div className="swap-commit-button">{swapCommitButton}</div>
    </FlexGap>
  )
}
