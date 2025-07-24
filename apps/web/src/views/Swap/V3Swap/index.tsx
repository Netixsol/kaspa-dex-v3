import { SmartRouter } from '@pancakeswap/smart-router/evm'
import throttle from 'lodash/throttle'
import { useMemo } from 'react'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'
import { Box } from '@pancakeswap/uikit'
import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import { useDerivedBestTradeWithMM } from '../MMLinkPools/hooks/useDerivedSwapInfoWithMM'

import { FormHeader, FormMain, MMTradeDetail, PricingAndSlippage, SwapCommitButton, TradeDetails } from './containers'
import { MMCommitButton } from './containers/MMCommitButton'
import { useSwapBestTrade } from './hooks'

export function V3SwapForm() {
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()

  const mm = useDerivedBestTradeWithMM(trade)
  const throttledHandleRefresh = useMemo(
    () =>
      throttle(() => {
        refresh()
      }, 3000),
    [refresh],
  )

  const finalTrade = mm.isMMBetter ? mm?.mmTradeInfo?.trade : trade

  const tradeLoaded = !isLoading
  const price = useMemo(() => trade && SmartRouter.getExecutionPrice(trade), [trade])

  return (
    <div style={{ background: "#252136" }}>
      <FormHeader onRefresh={throttledHandleRefresh} refreshDisabled={!tradeLoaded || syncing || !isStale} />
      <FormMain
        tradeLoading={mm.isMMBetter ? false : !tradeLoaded}
        // pricingAndSlippage={<PricingAndSlippage priceLoading={isLoading} price={price} showSlippage={!mm.isMMBetter} />}
        inputAmount={finalTrade?.inputAmount}
        outputAmount={finalTrade?.outputAmount}
        swapCommitButton={
          mm?.isMMBetter ? (
            <MMCommitButton {...mm} />
          ) : (
            <>
              {mm.isMMBetter ? (
                <MMTradeDetail loaded={!mm.mmOrderBookTrade.isLoading} mmTrade={mm.mmTradeInfo} />
              ) : (
                <div style={{ background: "#120F1F", borderRadius: "16px", paddingBottom: "4px" }}>
                  <TradeDetails loaded={tradeLoaded} trade={trade}
                  />
                  <PricingAndSlippage priceLoading={isLoading} price={price} showSlippage={!mm.isMMBetter} />
                </div>
              )}
              <SwapCommitButton trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />
            </>
          )
        }
      />


      {(shouldShowMMLiquidityError(mm?.mmOrderBookTrade?.inputError) || mm?.mmRFQTrade?.error) && !trade && (
        <Box mt="5px">
          <MMLiquidityWarning />
        </Box>
      )}
    </div>
  )
}
