import { Currency, CurrencyAmount, Token, ZERO, Price } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import {
  useRoi,
  RoiCalculatorModalV2,
  RoiCalculatorPositionInfo,
  TooltipText,
  Flex,
  CalculateIcon,
  Text,
  IconButton,
  QuestionHelper,
} from '@pancakeswap/uikit'
import { encodeSqrtRatioX96, parseProtocolFees, Pool, FeeCalculator } from '@pancakeswap/v3-sdk'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { formatPrice } from '@pancakeswap/utils/formatFractions'
import { useCakePriceAsBN } from '@pancakeswap/utils/useCakePrice'
import { useRouter } from 'next/router'
import { batch } from 'react-redux'
import { PositionDetails, getPositionFarmApr, getPositionFarmAprFactor } from '@pancakeswap/farms'

import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { Bound } from 'config/constants/types'
import { useAllV3Ticks } from 'hooks/v3/usePoolTickData'
import { Field } from 'state/mint/actions'
import { usePoolAvgTradingVolume } from 'hooks/usePoolTradingVolume'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { usePairTokensPrice } from 'hooks/v3/usePairTokensPrice'
import currencyId from 'utils/currencyId'
import { useFarm } from 'hooks/useFarm'

import { useV3FormState } from '../formViews/V3FormView/form/reducer'
import { useV3MintActionHandlers } from '../formViews/V3FormView/form/hooks/useV3MintActionHandlers'

interface Props {
  baseCurrency: Currency
  quoteCurrency: Currency
  feeAmount: number
  showTitle?: boolean
  showQuestion?: boolean
  allowApply?: boolean
  positionDetails?: PositionDetails
  defaultDepositUsd?: string
  tokenAmount0?: CurrencyAmount<Token>
  tokenAmount1?: CurrencyAmount<Token>
}

const AprButtonContainer = styled(Flex)`
  cursor: pointer;
`

const deriveUSDPrice = (baseUSDPrice?: Price<Currency, Currency>, pairPrice?: Price<Currency, Currency>) => {
  if (baseUSDPrice && pairPrice && pairPrice.greaterThan(ZERO)) {
    const baseUSDPriceFloat = parseFloat(formatPrice(baseUSDPrice, 6) || '0')
    return baseUSDPriceFloat / parseFloat(formatPrice(pairPrice, 6) || '0')
  }
  return undefined
}

export function AprCalculator({
  baseCurrency,
  quoteCurrency,
  feeAmount,
  showTitle = true,
  showQuestion = false,
  allowApply = true,
  positionDetails,
  defaultDepositUsd,
  tokenAmount0,
  tokenAmount1,
}: Props) {
  console.log('=== AprCalculator Debug ===')
  console.log('Props:', {
    baseCurrency: baseCurrency?.symbol,
    quoteCurrency: quoteCurrency?.symbol,
    feeAmount,
    showTitle,
    showQuestion,
    allowApply,
    positionDetails: !!positionDetails,
    defaultDepositUsd,
    tokenAmount0: tokenAmount0?.toExact(),
    tokenAmount1: tokenAmount1?.toExact(),
  })

  const { t } = useTranslation()
  const [isOpen, setOpen] = useState(false)
  const [priceSpan, setPriceSpan] = useState(0)
  const { data: farm } = useFarm({ currencyA: baseCurrency, currencyB: quoteCurrency, feeAmount })
  const cakePrice = useCakePriceAsBN()

  console.log('Initial state:', { isOpen, priceSpan, farm: !!farm, cakePrice: cakePrice?.toFixed() })

  const formState = useV3FormState()

  const { position: existingPosition } = useDerivedPositionInfo(positionDetails)
  const { pool, ticks, price, pricesAtTicks, parsedAmounts, currencyBalances } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    formState,
  )

  console.log('V3 Derived Info:', {
    pool: !!pool,
    poolAddress: pool ? Pool.getAddress(pool.token0, pool.token1, pool.fee) : null,
    ticks,
    price: price?.toSignificant(6),
    pricesAtTicks,
    parsedAmounts: {
      amountA: parsedAmounts[Field.CURRENCY_A]?.toExact(),
      amountB: parsedAmounts[Field.CURRENCY_B]?.toExact(),
    },
    currencyBalances: {
      balanceA: currencyBalances[Field.CURRENCY_A]?.toExact(),
      balanceB: currencyBalances[Field.CURRENCY_B]?.toExact(),
    },
  })

  const router = useRouter()
  const poolAddress = useMemo(() => pool && Pool.getAddress(pool.token0, pool.token1, pool.fee), [pool])

  console.log('Pool address:', poolAddress)

  const prices = usePairTokensPrice(poolAddress, priceSpan, baseCurrency?.chainId)
  const { ticks: data } = useAllV3Ticks(baseCurrency, quoteCurrency, feeAmount)
  const volume24H = usePoolAvgTradingVolume({
    address: poolAddress,
    chainId: pool?.token0.chainId,
  })

  console.log('Market data:', {
    prices: !!prices,
    ticksData: data?.length,
    volume24H: volume24H?.toFixed(),
  })

  const sqrtRatioX96 = price && encodeSqrtRatioX96(price.numerator, price.denominator)
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
  const { [Field.CURRENCY_A]: amountA, [Field.CURRENCY_B]: amountB } = parsedAmounts

  console.log('Price calculations:', {
    sqrtRatioX96: sqrtRatioX96?.toString(),
    tickLower,
    tickUpper,
    priceLower: priceLower?.toSignificant(6),
    priceUpper: priceUpper?.toSignificant(6),
    amountA: amountA?.toExact(),
    amountB: amountB?.toExact(),
  })

  const tokenA = (baseCurrency ?? undefined)?.wrapped
  const tokenB = (quoteCurrency ?? undefined)?.wrapped

  const inverted = Boolean(tokenA && tokenB && tokenA?.address !== tokenB?.address && tokenB.sortsBefore(tokenA))

  console.log('Token info:', {
    tokenA: tokenA?.symbol,
    tokenB: tokenB?.symbol,
    inverted,
  })

  const baseUSDPrice = useStablecoinPrice(baseCurrency)
  const quoteUSDPrice = useStablecoinPrice(quoteCurrency)
  const currencyAUsdPrice = baseUSDPrice
    ? parseFloat(formatPrice(baseUSDPrice, 6) || '0')
    : deriveUSDPrice(quoteUSDPrice, price?.baseCurrency.equals(quoteCurrency?.wrapped) ? price : price?.invert())
  const currencyBUsdPrice =
    baseUSDPrice &&
    (deriveUSDPrice(baseUSDPrice, price?.baseCurrency.equals(baseCurrency?.wrapped) ? price : price?.invert()) ||
      parseFloat(formatPrice(quoteUSDPrice, 6) || '0'))

  console.log('USD Prices:', {
    baseUSDPrice: baseUSDPrice?.toSignificant(6),
    quoteUSDPrice: quoteUSDPrice?.toSignificant(6),
    currencyAUsdPrice,
    currencyBUsdPrice,
  })

  const depositUsd = useMemo(
    () =>
      amountA &&
      amountB &&
      currencyAUsdPrice &&
      currencyBUsdPrice &&
      String(parseFloat(amountA.toExact()) * currencyAUsdPrice + parseFloat(amountB.toExact()) * currencyBUsdPrice),
    [amountA, amountB, currencyAUsdPrice, currencyBUsdPrice],
  )

  console.log('Deposit USD:', depositUsd)

  // For now the protocol fee is the same on both tokens so here we just use the fee on token0
  const [protocolFee] = useMemo(
    () => (pool?.feeProtocol && parseProtocolFees(pool.feeProtocol)) || [],
    [pool?.feeProtocol],
  )

  console.log('Protocol fee:', protocolFee)

  const applyProtocolFee = defaultDepositUsd ? undefined : protocolFee

  const validAmountA = amountA || (inverted ? tokenAmount1 : tokenAmount0)
  const validAmountB = amountB || (inverted ? tokenAmount0 : tokenAmount1)
  const [amount0, amount1] = inverted ? [validAmountB, validAmountA] : [validAmountA, validAmountB]

  console.log('Valid amounts:', {
    validAmountA: validAmountA?.toExact(),
    validAmountB: validAmountB?.toExact(),
    amount0: amount0?.toExact(),
    amount1: amount1?.toExact(),
  })

  const { apr } = useRoi({
    tickLower,
    tickUpper,
    sqrtRatioX96,
    fee: feeAmount,
    mostActiveLiquidity: pool?.liquidity,
    amountA: validAmountA,
    amountB: validAmountB,
    compoundOn: false,
    currencyAUsdPrice,
    currencyBUsdPrice,
    volume24H,
    protocolFee: applyProtocolFee,
  })
  console.log('ROI calculation:', {
    apr: apr?.toSignificant(6),
    tickLower,
    tickUpper,
    sqrtRatioX96: sqrtRatioX96?.toString(),
    fee: feeAmount,
    mostActiveLiquidity: pool?.liquidity?.toString(),
    amountA: validAmountA?.toExact(),
    amountB: validAmountB?.toExact(),
    currencyAUsdPrice,
    currencyBUsdPrice,
    volume24H: volume24H?.toFixed(),
    protocolFee: applyProtocolFee,
  })

  const positionLiquidity = useMemo(
    () =>
      existingPosition?.liquidity ||
      (validAmountA &&
        validAmountB &&
        sqrtRatioX96 &&
        typeof tickLower === 'number' &&
        typeof tickUpper === 'number' &&
        FeeCalculator.getLiquidityByAmountsAndPrice({
          amountA: validAmountA,
          amountB: validAmountB,
          tickUpper,
          tickLower,
          sqrtRatioX96,
        })),
    [existingPosition, validAmountA, validAmountB, tickUpper, tickLower, sqrtRatioX96],
  )

  console.log('Position liquidity:', {
    existingPositionLiquidity: existingPosition?.liquidity?.toString(),
    calculatedLiquidity: positionLiquidity?.toString(),
  })

  const { positionFarmApr, positionFarmAprFactor } = useMemo(() => {
    if (!farm || !cakePrice || !positionLiquidity || !amount0 || !amount1) {
      console.log('Farm APR calculation skipped - missing data:', {
        hasFarm: !!farm,
        hasCakePrice: !!cakePrice,
        hasPositionLiquidity: !!positionLiquidity,
        hasAmount0: !!amount0,
        hasAmount1: !!amount1,
      })
      return {
        positionFarmApr: '0',
        positionFarmAprFactor: new BigNumber(0),
      }
    }
    const { farm: farmDetail, cakePerSecond } = farm
    const { poolWeight, token, quoteToken, tokenPriceBusd, quoteTokenPriceBusd, lmPoolLiquidity } = farmDetail
    const [token0Price, token1Price] = token.sortsBefore(quoteToken)
      ? [tokenPriceBusd, quoteTokenPriceBusd]
      : [quoteTokenPriceBusd, tokenPriceBusd]
    const positionTvlUsd = +amount0.toExact() * +token0Price + +amount1.toExact() * +token1Price

    console.log('Farm calculation inputs:', {
      poolWeight,
      token0Price,
      token1Price,
      positionTvlUsd,
      cakePriceUsd: cakePrice.toFixed(),
      liquidity: positionLiquidity.toString(),
      cakePerSecond,
      totalStakedLiquidity: lmPoolLiquidity,
    })

    const result = {
      positionFarmApr: getPositionFarmApr({
        poolWeight,
        positionTvlUsd,
        cakePriceUsd: cakePrice,
        liquidity: positionLiquidity,
        cakePerSecond,
        totalStakedLiquidity: lmPoolLiquidity,
      }),
      positionFarmAprFactor: getPositionFarmAprFactor({
        poolWeight,
        cakePriceUsd: cakePrice,
        liquidity: positionLiquidity,
        cakePerSecond,
        totalStakedLiquidity: lmPoolLiquidity,
      }),
    }

    console.log('Farm APR result:', result)
    return result
  }, [farm, cakePrice, positionLiquidity, amount0, amount1])

  // NOTE: Assume no liquidity when opening modal
  const { onFieldAInput, onBothRangeInput, onSetFullRange } = useV3MintActionHandlers(false)

  const closeModal = useCallback(() => setOpen(false), [])
  const onApply = useCallback(
    (position: RoiCalculatorPositionInfo) => {
      console.log('Applying position:', {
        amountA: position.amountA?.toExact(),
        amountB: position.amountB?.toExact(),
        priceLower: position.priceLower?.toSignificant(6),
        priceUpper: position.priceUpper?.toSignificant(6),
        fullRange: position.fullRange,
      })

      batch(() => {
        const isToken0Price =
          position.amountA?.wrapped?.currency &&
          position.amountB?.wrapped?.currency &&
          position.amountA.wrapped.currency.sortsBefore(position.amountB.wrapped.currency)
        if (position.fullRange) {
          onSetFullRange()
        } else {
          onBothRangeInput({
            leftTypedValue: isToken0Price ? position.priceLower?.toFixed() : position?.priceUpper?.invert()?.toFixed(),
            rightTypedValue: isToken0Price ? position.priceUpper?.toFixed() : position?.priceLower?.invert()?.toFixed(),
          })
        }

        onFieldAInput(position.amountA?.toExact() || '')
      })
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            currency: [
              position.amountA ? currencyId(position.amountA.currency) : undefined,
              position.amountB ? currencyId(position.amountB.currency) : undefined,
              feeAmount ? feeAmount.toString() : '',
            ],
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
      closeModal()
    },
    [closeModal, feeAmount, onBothRangeInput, onFieldAInput, onSetFullRange, router],
  )

  if (!data || !data.length) {
    console.log('No tick data available, returning null')
    return null
  }

  const hasFarmApr = positionFarmApr && +positionFarmApr > 0
  const combinedApr = hasFarmApr ? +apr.toSignificant(6) + +positionFarmApr : +apr.toSignificant(6)
  const aprDisplay = combinedApr.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })

  console.log('Final APR calculation:', {
    hasFarmApr,
    baseApr: apr.toSignificant(6),
    farmApr: positionFarmApr,
    combinedApr,
    aprDisplay,
  })

  const farmAprTips = hasFarmApr ? (
    <>
      <Text bold>{t('This position must be staking in farm to apply the combined APR with farming rewards.')}</Text>
      <br />
    </>
  ) : null
  const AprText = hasFarmApr ? TooltipText : Text

  console.log('=== End AprCalculator Debug ===')

  return (
    <>
      <Flex flexDirection="column">
        {showTitle && (
          <Text color="textSubtle" fontSize="12px">
            {hasFarmApr ? t('APR (with farming)') : t('APR')}
          </Text>
        )}
        <AprButtonContainer onClick={() => setOpen(true)} alignItems="center">
          <AprText>{aprDisplay}%</AprText>
          <IconButton variant="text" scale="sm" onClick={() => setOpen(true)}>
            <CalculateIcon color="textSubtle" ml="0.25em" width="24px" />
          </IconButton>
          {showQuestion ? (
            <QuestionHelper
              text={
                <>
                  {farmAprTips}
                  {t(
                    'Calculated at the current rates with historical trading volume data, and subject to change based on various external variables.',
                  )}
                  <br />
                  <br />
                  {t(
                    'This figure is provided for your convenience only, and by no means represents guaranteed returns.',
                  )}
                </>
              }
              size="20px"
              placement="top"
            />
          ) : null}
        </AprButtonContainer>
      </Flex>
      <RoiCalculatorModalV2
        allowApply={allowApply}
        isOpen={isOpen}
        onDismiss={closeModal}
        depositAmountInUsd={defaultDepositUsd || depositUsd}
        prices={prices}
        price={price}
        currencyA={baseCurrency}
        currencyB={quoteCurrency}
        balanceA={currencyBalances[Field.CURRENCY_A]}
        balanceB={currencyBalances[Field.CURRENCY_B]}
        currencyAUsdPrice={currencyAUsdPrice}
        currencyBUsdPrice={currencyBUsdPrice}
        sqrtRatioX96={sqrtRatioX96}
        liquidity={pool?.liquidity}
        feeAmount={feeAmount}
        protocolFee={applyProtocolFee}
        ticks={data}
        volume24H={volume24H}
        priceUpper={priceUpper}
        priceLower={priceLower}
        priceSpan={priceSpan}
        onPriceSpanChange={setPriceSpan}
        onApply={onApply}
        isFarm={hasFarmApr}
        cakeAprFactor={positionFarmAprFactor}
        cakePrice={cakePrice.toFixed(3)}
      />
    </>
  )
}
