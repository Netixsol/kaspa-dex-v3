import { useTranslation } from '@pancakeswap/localization'
import { Price, Currency } from '@pancakeswap/sdk'
import { memo } from 'react'

import { useUserSlippage } from '@pancakeswap/utils/user'
import { Box, FlexGap, Info, InfoLabel, Text, TradePrice, useModal } from '@pancakeswap/uikit'
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
    <FlexGap paddingTop="6px" justifyContent="space-between" alignItems="center" width="100%">
      <InfoLabel>{t('Price')}</InfoLabel>
      <TradePrice price={price} loading={priceLoading} />
    </FlexGap>
  ) : (
    <FlexGap paddingTop="6px" justifyContent="space-between" alignItems="center" width="100%">
      <Text color="white" fontSize={14}>
        {t('Price')}
      </Text>
      <Text color="white" fontSize={14}>
        {t('-')}
      </Text>
    </FlexGap>
  )

  return (
    <Info
      price={priceNode}
      allowedSlippage={showSlippage ? allowedSlippage : undefined}
      onSlippageClick={onPresentSettingsModal}
    />
  )
})
