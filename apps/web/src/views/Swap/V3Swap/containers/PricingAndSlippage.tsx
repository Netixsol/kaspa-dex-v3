import { Swap as SwapUI, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Price, Currency } from '@pancakeswap/sdk'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { memo } from 'react'

import SettingsModal from '../../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../../components/Menu/GlobalSettings/types'
import { useIsWrapping } from '../hooks'

interface Props {
  showSlippage?: boolean
  priceLoading?: boolean
  price?: Price<Currency, Currency>
}

export const PricingAndSlippage = memo(function PricingAndSlippage({
  priceLoading,
  price,
  showSlippage = true,
}: Props) {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippage()
  const isWrapping = useIsWrapping()
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  if (isWrapping) {
    return null
  }

  const priceNode = price ? (
    <div style={{ paddingLeft: "10px", paddingRight: "10px", display: "flex", justifyContent: "space-between", width: "100%" }}>
      <SwapUI.InfoLabel>{t('Price')}</SwapUI.InfoLabel>
      <SwapUI.TradePrice price={price} loading={priceLoading} />
    </div>
  ) : null

  return (
    <SwapUI.Info
      price={priceNode}
      allowedSlippage={showSlippage ? allowedSlippage : undefined}
      onSlippageClick={onPresentSettingsModal}
    />
  )
})
