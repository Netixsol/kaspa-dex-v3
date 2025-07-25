import { AutoColumn, Button } from '@pancakeswap/uikit'
import { useCallback, memo, useState } from 'react'
import Lottie from 'lottie-react'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { useTranslation } from '@pancakeswap/localization'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import { AutoRow } from 'components/Layout/Row'

import { useExpertMode } from '@pancakeswap/utils/user'
import styled from 'styled-components'
import { useAllowRecipient } from '../hooks'
import swapArrowsAnimationData from './swap-animation.json'

const CustomBorder = styled.div`
  background: #26ff87;
  /* border: 2px solid #252136; */
  border-radius: 12px;
  padding: 4px;
`
export const FlipButton = memo(function FlipButton() {
  const { t } = useTranslation()
  const [isExpertMode] = useExpertMode()
  const { onSwitchTokens, onChangeRecipient } = useSwapActionHandlers()
  const {
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const allowRecipient = useAllowRecipient()

  const onFlip = useCallback(() => {
    onSwitchTokens()
    replaceBrowserHistory('inputCurrency', outputCurrencyId)
    replaceBrowserHistory('outputCurrency', inputCurrencyId)
  }, [onSwitchTokens, inputCurrencyId, outputCurrencyId])
  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false)

  return (
    <AutoColumn justify="space-between">
      <AutoRow justify={isExpertMode ? 'space-between' : 'center'}>
        <Button
          variant="text"
          onClick={onFlip}
          onMouseEnter={() => setAnimateSwapArrows(true)}
          onMouseLeave={() => setAnimateSwapArrows(false)}
        >
          <CustomBorder>
            {animateSwapArrows ? (
              <Lottie animationData={swapArrowsAnimationData} loop autoplay style={{ width: 36, height: 36 }} />
            ) : (
              <Lottie animationData={swapArrowsAnimationData} loop={false} autoplay style={{ width: 36, height: 36 }} />
            )}
          </CustomBorder>
        </Button>
        {allowRecipient && recipient === null ? (
          <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
            {t('+ Add a send (optional)')}
          </Button>
        ) : null}
      </AutoRow>
    </AutoColumn>
  )
})
