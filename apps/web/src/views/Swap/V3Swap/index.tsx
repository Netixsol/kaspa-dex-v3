import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { ArrowBackIcon, AutoRow, Box, Button, CopyButton, FlexGap, Skeleton, Text } from '@pancakeswap/uikit'
import { useEffect, useMemo, useState } from 'react'
import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'

import { Currency } from '@pancakeswap/swap-sdk-core'
import AddToWalletButton from 'components/AddToWallet/AddToWalletButton'
import { CurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTokenInfo from 'hooks/useTokenInfo'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'
import { shortenAddress } from 'views/V3Info/utils'
import { useCurrency } from 'hooks/Tokens'
import { useSwapState } from 'state/swap/hooks'
import { useDerivedBestTradeWithMM } from '../MMLinkPools/hooks/useDerivedSwapInfoWithMM'
import { formatLongNumber, formattedNum } from '../TokenInfo/swapUtils'
import { Wrapper } from '../components/styleds'
import { FormHeader, FormMain, MMTradeDetail, PricingAndSlippage, SwapCommitButton, TradeDetails } from './containers'
import { MMCommitButton } from './containers/MMCommitButton'
import { useSwapBestTrade } from './hooks'
import { InfoRow, InfoRowLabel, InfoRowValue, TabContainer, TabText } from './infoTokenStyles'

const Tab = styled.div<{ isActive?: boolean; isLeft?: boolean }>`
  display: flex;
  justify-content: space-between;

  /* min-width: 140px; */
  /* gap: 10px; */
  align-items: center;
  width: 100%;
  flex: 1;
  background-color: ${({ isActive }) => (isActive ? '#26FF87' : '#120F1F')};
  padding: 5px 12px;
  font-size: 14px;
  font-weight: 500;
  /* height: 30px */
  width: 100%;
  border-radius: 999px !important;
  cursor: pointer;
  width: 100%;
  &:hover {
    text-decoration: none;
  }
`
export const StyledWrapper = styled(Wrapper)`
  @media (min-width: 968px) {
    transform: scale(0.85);
    position: absolute;
    top: -45px;
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
    min-height: 547px;
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
`
enum TAB {
  TOKEN_IN,
  TOKEN_OUT,
}
const NOT_AVAIALBLE = '--'
export function V3SwapForm() {
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()

  const mm = useDerivedBestTradeWithMM(trade)

  const finalTrade = mm.isMMBetter ? mm?.mmTradeInfo?.trade : trade

  const tradeLoaded = !isLoading
  const price = useMemo(() => trade && SmartRouter.getExecutionPrice(trade), [trade])

  // const {
  //   v2Trade,
  //   currencyBalances,
  //   parsedAmount,
  //   inputError: swapInputError,
  // } = useDerivedSwapInfoWithMM(independentField, typedValue, inputCurrency, outputCurrency, recipient)
  // const parsedAmounts = showWrap
  //   ? {
  //       [Field.INPUT]: parsedAmount,
  //       [Field.OUTPUT]: parsedAmount,
  //     }
  //   : {
  //       [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
  //       [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
  //     }
  // const hasAmount = Boolean(parsedAmount)

  // const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )
  const [info, setInfoState] = useState(true)

  return (
    <>
      {!info ? (
        <>
          <TokenInfo currencies={currencies} onBack={setInfoState} info={info} />
        </>
      ) : (
        <>
          <StyledWrapper id="swap-page" style={{ background: '#252136' }}>
            <FormHeader
              info={info}
              setInfoState={setInfoState}
              onRefresh={refresh}
              refreshDisabled={!tradeLoaded || syncing || !isStale}
            />
            <FormMain
              trade={trade}
              tradeLoading={mm.isMMBetter ? false : !tradeLoaded}
              inputAmount={finalTrade?.inputAmount}
              outputAmount={finalTrade?.outputAmount}
              swapCommitButton={
                mm?.isMMBetter ? (
                  <Box paddingTop="10px">
                    <MMCommitButton {...mm} />
                  </Box>
                ) : (
                  <Box paddingTop="10px">
                    <SwapCommitButton trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />
                  </Box>
                )
              }
              deteils={
                mm.isMMBetter ? (
                  <MMTradeDetail loaded={!mm?.mmOrderBookTrade?.isLoading} mmTrade={mm?.mmTradeInfo} />
                ) : (
                  //  <></>
                  <TradeDetails
                    priceandslipage={
                      <PricingAndSlippage priceLoading={isLoading} price={price} showSlippage={!mm.isMMBetter} />
                    }
                    loaded={tradeLoaded}
                    trade={trade}
                  />
                )
              }
              // }
            />

            {mm.isMMBetter ? (
              // <></>
              <MMTradeDetail loaded={!mm?.mmOrderBookTrade?.isLoading} mmTrade={mm?.mmTradeInfo} />
            ) : (
              <></>
              // <TradeDetails loaded={tradeLoaded} trade={trade} />
            )}
            {(shouldShowMMLiquidityError(mm?.mmOrderBookTrade?.inputError) || mm?.mmRFQTrade?.error) && !trade && (
              <Box mt="5px">
                <MMLiquidityWarning />
              </Box>
            )}
          </StyledWrapper>
        </>
      )}
    </>
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

        <FlexGap justifyContent="space-between" alignItems="center" width="100%">
          <Text fontSize={14} style={{ whiteSpace: 'nowrap' }}>
            Contract Address
          </Text>
          <AutoRow width="100%" gap="4px" pb={['12px', '12px', null, null]} position="relative">
            {selectedToken ? (
              <FlexGap gap="10px" alignItems="center" justifyContent="flex-end" alignContent="center" width="100%">
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
        </FlexGap>
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
