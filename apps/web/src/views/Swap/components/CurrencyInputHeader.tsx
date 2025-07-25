import dynamic from 'next/dynamic';
import {
  ChartDisableIcon,
  ChartIcon,
  FlexGap,
  IconButton,
  NotificationDot,
  Swap,
  useModal
} from '@pancakeswap/uikit'
import { useExpertMode } from '@pancakeswap/utils/user'
// import GlobalSettings from 'components/Menu/GlobalSettings'
// import HoverLottie from 'components/Menu/GlobalSettings/HoverLottie'

import { ShareModel } from 'components/Menu/GlobalSettings/ShareModel'
import SwapDropdown from 'components/SwitchDropDown'
import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
import { SwapFeaturesContext } from '../SwapFeaturesContext'
import share from './share.json'

const HoverLottie = dynamic(() => import('components/Menu/GlobalSettings/HoverLottie'), { ssr: false });

const GlobalSettings = dynamic(() => import('components/Menu/GlobalSettings'), { ssr: false })
interface Props {
  title: string | ReactElement
  subtitle: string
  trade?: any
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  allowedSlippage?: number
  hasAmount: boolean
  onRefreshPrice: () => void
  info: any,
  setInfoState: any
}

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
`

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = ({
  // trade,
  title,
  // allowedSlippage,
  // subtitle,
  // hasAmount,
  // onRefreshPrice,
  info,
}) => {
  const { isChartSupported, isChartDisplayed, setIsChartDisplayed } = useContext(SwapFeaturesContext)
  const [expertMode] = useExpertMode()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  // const handleOnClick = useCallback(() => onRefreshPrice?.(), [onRefreshPrice])

  const [onCopyModel] = useModal(<ShareModel mode="" />)
  const options = [

    {
      label: 'Liquidity',
      value: 'liquidity',
    },
    {
      label: 'Add',
      value: 'add',
    },
    {
      label: 'Find',
      value: '/find',
    },

  ]

  return (
    <div>
      <Swap.CurrencyInputHeader
        title={
          <>
            {/* <Flex justifyContent="space-between" alignItems="center"  width="100%" > */}
            <div>
              <SwapDropdown options={options}/>
                {/* <Text
                  display="flex"
                  style={{ justifyContent: 'space-between', alignItems: 'center' }}
                  width="100%"
                  fontFamily="Inter"
                  fontSize={24}
                  fontWeight={400}
                  color="white"
                >
                  {title}
                </Text> */}
            </div>

            <div>
              <NotificationDot show={expertMode}>
                <FlexGap alignItems="center" columnGap="15px">
                  {isChartSupported && setIsChartDisplayed && (
                    <ColoredIconButton onClick={toggleChartDisplayed} variant="text" scale="sm">
                      {isChartDisplayed ? (
                        <ChartDisableIcon width="26px" color="textSubtle" />
                      ) : (
                        <ChartIcon width="30px" color="textSubtle" />
                      )}
                    </ColoredIconButton>
                  )}
                  {/* <Button variant="text" onClick={() => setInfoState(!info)}>
                    Info
                  </Button> */}

                  {info}

                  <HoverLottie
                    onClick={onCopyModel}
                    animationData={share}
                  style={{
                      height: '22px',
                      marginBottom: '8px',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  />

                  <GlobalSettings color="primary" mr="0" mode={SettingsMode.SWAP_LIQUIDITY} />
                </FlexGap>
              </NotificationDot>
            </div>
          </>
        }
        subtitle={<Swap.CurrencyInputHeaderSubTitle>{""}{/* {subtitle} */}</Swap.CurrencyInputHeaderSubTitle>}
      />
    </div>
  )
}

export default CurrencyInputHeader
