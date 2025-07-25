import { BottomDrawer, Card, Flex, FlexGap, Heading, PageHeader, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useContext, useEffect, useMemo } from 'react'

import styled from 'styled-components'

// import SwapForm from './components/SwapForm'
import { Currency } from '@pancakeswap/sdk'
import { useCurrency } from 'hooks/Tokens'
import { useSingleTokenSwapInfo, useSwapState } from 'state/swap/hooks'
import { SwapFeaturesContext } from './SwapFeaturesContext'
import { V3SwapForm } from './V3Swap'

import { StyledInputCurrencyWrapper } from './styles'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const CardWidth = styled(Card)`
  border-radius: 24px;
  width: 100%;
  z-index: 1;
  background: none;
`

const SwapWrapper = styled(FlexGap)`
  margin-top: 80px;
`

const StyledContainer = styled(PageHeader)`
  max-width: 1250px !important;
`

// const StyledTableBox = styled.div`
//   margin-top: 150px;
//   padding-top: 16px;
//   padding-bottom: 240px;
//   position: relative;
//   width: 100%;
//   &::before {
//     position: absolute;
//     content: '';
//     top: 0;
//     left: -32px;
//     right: -32px;
//     bottom: -50px;
//     background-image: url('/bg-home.svg');
//     background-repeat: no-repeat;
//     background-position: top;
//     z-index: -1;
//   }
//   ${({ theme }) => theme.mediaQueries.md} {
//     padding-top: 48px;
//   }
// `

// const StyledTableBox = styled.div`
//   margin-top: 70px;
//   height: 100%;
//   padding-top: 16px;
//   padding-bottom: 330px;
//   position: relative;
//   width: 100%;
//   &::before {
//     position: absolute;
//     content: '';
//     top: 0;
//     left: -32px;
//     right: -32px;
//     bottom: -50px;
//     background-image: url('/bg-home.svg');
//     background-repeat: no-repeat;
//     background-position: center;
//     z-index: -1;
//   }
//   ${({ theme }) => theme.mediaQueries.md} {
//     padding-top: 48px;
//   }
// `

export default function Swap() {
  const { isMobile, isDesktop } = useMatchBreakpoints()
  //

  const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, setIsChartExpanded, isChartSupported } =
    useContext(SwapFeaturesContext)

  // swap state & price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }
  // const selectedToken = currencies[Field.INPUT] ?? currencies[Field.OUTPUT]
  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)

  // const [activeTab, setActiveTab] = useState(TAB.TOKEN_IN)
  // const selectedToken = activeTab === TAB.TOKEN_OUT ? outputToken : inputToken
  // const { data: tokenInfo, loading } = useTokenInfo(selectedToken)
  // const { data: tokenInfoB } = useTokenInfo(outputToken)

  // console.log(tokenInfo, 'tokenInfo')

  // const allTokens = useAllTokenDataSWR()

  // const formattedTokens = useMemo(() => {
  //   return Object.values(allTokens)
  //     .map((token) => token.data)
  //     .filter((token) => token.name !== 'unknown')
  // }, [allTokens])

  // useEffect(() => {
  //   setTimeout(() => {
  //     startTour(swapSteps)
  //   }, 3000)
  // }, [])

  return (
    <>
      <StyledContainer background="none" pt={20} pb={50}>
        <SwapWrapper
          // width={['100%', , '100%']}
          // style={{ transform: 'scale(0.9)' }}
          marginTop={30}
          mb={20}
          flexWrap={['wrap', null, null, null, 'nowrap']}
          // alignItems="end"
          justifyContent="center"

          // position="relative"
        >
          <Flex flexDirection="column" width="100%" maxWidth="480px">
            <StyledInputCurrencyWrapper marginLeft={['0px', '0px', isChartDisplayed ? '-45px' : '0px']}>
              <V3SwapForm />
            </StyledInputCurrencyWrapper>
          </Flex>
        </SwapWrapper>
      </StyledContainer>
      {/* <StyledTableBox>
        <PageHeader background="none">
          <Heading scale="lg" mb="16px">
            <Text fontFamily="Inter" fontSize={['20px', null, '24px']} color="white" fontWeight="bold">
              Top Tokens
            </Text>
          </Heading>
          <TokenTable tokenDatas={formattedTokens} loading showBtn />
        </PageHeader>
      </StyledTableBox> */}
    </>
  )
}

// export default function Swap() {
//   const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, setIsChartExpanded, isChartSupported } =
//     useContext(SwapFeaturesContext)

//   return (
//     <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
//       <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
//         <Flex flexDirection="column">
//           <StyledSwapContainer $isChartExpanded={isChartExpanded}>
//             <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
//               <AppBody>
//                 <V3SwapForm />
//               </AppBody>
//             </StyledInputCurrencyWrapper>
//           </StyledSwapContainer>
//         </Flex>
//       </Flex>
//     </Page>
//   )
// }
