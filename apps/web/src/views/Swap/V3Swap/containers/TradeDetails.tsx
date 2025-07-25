import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { AutoColumn, QuestionHelper, RowBetween, RowFixed, Text } from '@pancakeswap/uikit'
import useLastTruthy from 'hooks/useLast'
import { useMemo, memo } from 'react'

import { AdvancedSwapDetails } from 'views/Swap/components/AdvancedSwapDetails'

import { MMTradeInfo } from 'views/Swap/MMLinkPools/hooks'
import { RoutesBreakdown } from '../components'
import { useSlippageAdjustedAmounts, useIsWrapping } from '../hooks'
import { computeTradePriceBreakdown } from '../utils/exchange'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { Field } from 'state/swap/actions'
import FormattedPriceImpact from 'views/Swap/components/FormattedPriceImpact'

interface Props {
  loaded: boolean
  trade?: SmartRouterTrade<TradeType> | null
  priceandslipage?: React.ReactNode
}

export const TradeSummary = memo(function TradeSummary({
  priceandslipage,
  inputAmount,
  outputAmount,
  tradeType,
  slippageAdjustedAmounts,
  priceImpactWithoutFee,
  realizedLPFee,
  isMM = false,
}: {
  priceandslipage?: React.ReactNode
  hasStablePair?: boolean
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  slippageAdjustedAmounts: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency>
  isMM?: boolean
}) {
  const { t } = useTranslation()
  const isExactIn = tradeType === TradeType.EXACT_INPUT

  return (
    <AutoColumn style={{ padding: '0 24px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {isExactIn ? t('Minimum received') : t('Maximum sold')}
          </Text>
          <QuestionHelper
            text={<Text color='black'>
              Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.
            </Text>}
            ml="4px"
            placement="top"
          />
        </RowFixed>
        <RowFixed>
          <Text fontSize="14px">
            {isExactIn
              ? slippageAdjustedAmounts[Field.OUTPUT]
                ? `${formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 4)} ${outputAmount.currency.symbol}`
                : '-'
              : slippageAdjustedAmounts[Field.INPUT]
                ? `${formatAmount(slippageAdjustedAmounts[Field.INPUT], 4)} ${inputAmount.currency.symbol}`
                : '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      {/* {priceImpactWithoutFee && ( */}
      <RowBetween style={{ padding: '6px 0 0 0' }}>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {t('Price Impact')}
          </Text>
          <QuestionHelper
            text={
              <>
                <Text>
                  <Text bold display="inline-block" color='black'>
                    {t('AMM')}
                  </Text>
                  <Text display="inline-block" color='black'>The difference between the market price and estimated price due to trade size.</Text>
                </Text>
                <Text mt="10px">
                  <Text bold display="inline-block" color='black'>
                    {t('MM')}
                  </Text>
                  <Text display="inline-block" color='black'>No slippage against quote from market maker</Text>
                </Text>
              </>
            }
            ml="4px"
            placement="top"
          />
        </RowFixed>
        {isMM ? (
          <Text color="textSubtle">--</Text>
        ) : (
          <>{priceImpactWithoutFee ? <FormattedPriceImpact priceImpact={priceImpactWithoutFee} /> : '-'}</>
        )}
      </RowBetween>
      {/* )} */}

      {/* {realizedLPFee && ( */}
      <RowBetween style={{ padding: '6px 0 0 0' }}>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {t('Trading Fee')}
          </Text>
          <QuestionHelper
            text={
              <>
                <Text mb="12px">
                  <Text bold display="inline-block" color='black'>
                    {t('AMM')}
                  </Text>
                  :{' '}
                  <Text color='black'>
                    Fee ranging from 0.1% to 0.01% depending on the pool fee tier. You can check the fee tier by clicking the magnifier icon under the “Route” section.
                  </Text>
                </Text>
                {/* <Text mt="12px">
                  <Link
                    style={{ display: 'inline' }}
                    ml="4px"
                    external
                    href="https://docs.moonbase.finance/products/moonbase-exchange/faq#what-will-be-the-trading-fee-breakdown-for-v3-exchange"
                  >
                    {t('Fee Breakdown and Tokenomics')}
                  </Link>
                </Text> */}
                <Text mt="10px">
                  <Text bold display="inline-block" color='black'>
                    {t('MM')}
                  </Text>
                  :{' '}
                  <Text display="inline-block" color='black'>
                    Kaspa Finance does not charge any fees for trades. However, the market makers charge an implied fee of 0.05% (non-stablecoin) / 0.01% (stablecoin) factored into the quotes provided by them. </Text>
                </Text>
              </>
            }
            ml="4px"
            placement="top"
          />
        </RowFixed>
        <Text fontSize="14px">
          {realizedLPFee ? `${formatAmount(realizedLPFee, 4)} ${inputAmount.currency.symbol}` : '-'}
        </Text>
      </RowBetween>
      {/* {priceandslipage} */}
      {/* )} */}
    </AutoColumn>
  )
})

export const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '7px' : 0)};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background};

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

export function MMTradeDetail({ loaded, mmTrade }: { loaded: boolean; mmTrade?: MMTradeInfo }) {
  const lastTrade = useLastTruthy(mmTrade?.trade)

  return (
    <AdvancedDetailsFooter show={loaded}>
      <AutoColumn gap="0px">
        {lastTrade && (
          <AdvancedSwapDetails
            pairs={lastTrade?.route.pairs}
            path={lastTrade?.route.path}
            slippageAdjustedAmounts={mmTrade?.slippageAdjustedAmounts}
            realizedLPFee={mmTrade?.realizedLPFee}
            inputAmount={mmTrade?.inputAmount}
            outputAmount={mmTrade?.outputAmount}
            tradeType={mmTrade?.tradeType}
            priceImpactWithoutFee={mmTrade?.priceImpactWithoutFee}
            isMM
          />
        )}
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
}

export const TradeDetails = memo(function TradeDetails({ loaded, trade, priceandslipage }: Props) {
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade)
  const isWrapping = useIsWrapping()
  const { priceImpactWithoutFee, lpFeeAmount } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const hasStablePool = useMemo(
    () => trade?.routes.some((route) => route.pools.some(SmartRouter.isStablePool)),
    [trade],
  )

  if (isWrapping) {
    return null
  }

    const oldtrader = trade || {
    inputAmount: undefined,
    outputAmount: undefined,
    tradeType: undefined,
    routes: undefined,
  }

  const { inputAmount, outputAmount, tradeType, routes } = oldtrader

  return (
    <AdvancedDetailsFooter show>
      <AutoColumn gap="0px">
        <TradeSummary
          slippageAdjustedAmounts={slippageAdjustedAmounts}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
          tradeType={tradeType}
          priceImpactWithoutFee={priceImpactWithoutFee}
          realizedLPFee={lpFeeAmount}
          hasStablePair={hasStablePool}
        />
        <RoutesBreakdown routes={routes} />
        {priceandslipage}
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
})
