import { useTranslation } from '@pancakeswap/localization'
import { Currency, Pair } from '@pancakeswap/sdk'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import {
  Box,
  Button,
  ChevronDownIcon,
  CopyButton,
  Flex,
  NumericalInput,
  Text,
  WalletFilledIcon,
  useModal,
} from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'
import { isAddress } from 'utils'

// import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import Loading from 'components/Loading'
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'

import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { useAccount } from 'wagmi'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'

import AddToWalletButton from '../AddToWallet/AddToWalletButton'
// import { Label } from 'views/Voting/CreateProposal/styles'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0px 0px;
  @media (min-width: 5px) {
    padding: 0px 10px;
  }

  justify-content: flex-end;
  // padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const UserBalanceContainer = styled.div`
  padding: 5px 10px;
  gap: 5px;
  background: #252136;
  border-radius: 15px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm', padding: 'none', margin: 'none' })<{
  zapStyle?: ZapStyle
}>`
  background-color: #252136;
  border-radius: 19px;
  padding: 5px 10px;
  /* border-left: 1px solid #41499a; */
  /* ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      background: ${theme.colors.background};
      border: 1px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '0px' : '8px'} 8px 0px 0px;
      height: auto;
    `}; */
`

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // flex-flow: row nowrap;
  align-items: center;
  /* Aveneir font family */
  font-family: Inter;

  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 8px;
`
export const InputPanel = styled.div`
  display: flex;
  /* margin-bottom: 26px; */
  border-radius: 20px;
  font-family: Inter;

  justify-content: space-between;
  flex-flow: column nowrap;
  position: relative;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean }>`
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
  height: 100%;
  padding: 2px 15px;
  border-radius: 20px;
  padding-bottom: 10px;
  ${({ zapStyle }) =>
    !!zapStyle &&
    css`
      padding: 2px 20px;
      padding-bottom: 15px;
    `};
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onPercentInput?: (percent: number) => void
  onMax?: () => void
  showQuickInputButton?: boolean
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | StablePair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showBUSD?: boolean
  backgroundColor?: string
  showUSDPrice?: boolean
  maxAmount?: any
  currencyLoading?: boolean
  inputLoading?: boolean
  lpPercent?: string
}
export default function CurrencyInputPanel({
  lpPercent,
  currencyLoading,
  inputLoading,
  value,
  onUserInput,
  onInputBlur,
  backgroundColor,
  onPercentInput,
  onMax,
  showQuickInputButton = false,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  disabled,
  error,
  showBUSD,
}: CurrencyInputPanelProps) {
  const { address: account } = useAccount()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()

  const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null

  // const amountInDollar = useBUSDCurrencyAmount(
  //   showBUSD ? currency : undefined,
  //   Number.isFinite(+value) ? +value : undefined,
  // )

  const amountInDollar = useStablecoinPriceAmount(
    showBUSD ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
    {
      hideIfPriceImpactTooHigh: true,
      enabled: Number.isFinite(+value),
    },
  )
  // const tokenPrice = useStablePrice(currency)

  // const amountInDollar = tokenPrice ? multiplyPriceByAmount(tokenPrice, +value, currency?.decimals) : 0

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
  )

  return (
    <Box position="relative" id={id}>
      <Flex alignItems="center" justifyContent="space-between">
        {/*   <Text
          color="#BDC3CE"
          // mb={3}
          padding="0px 13px 0px 5px"
          fontSize="16px"
          style={{ display: 'inline', cursor: 'pointer' }}
          fontFamily="Inter"
          letterSpacing="1.3px"
        >
          {label}
  </Text> */}
      </Flex>
      <InputPanel>
        <Container
          as="label"
          zapStyle={zapStyle}
          error={error}
          style={{
            backgroundColor,
          }}
        >
          <LabelRow>
            <NumericalInput
              align="left"
              fontSize="20px"
              color="white"
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />

            <Flex>
              {beforeButton}
              <CurrencySelectButton
                // style={{ backgroundColor: 'rgb(39, 56, 85)' }}
                // zapStyle={zapStyle}
                className="open-currency-select-button"
                selected={!!currency}
                onClick={() => {
                  if (!disableCurrencySelect) {
                    onPresentCurrencyModal()
                  }
                }}
              >
                <Flex alignItems="center" justifyContent="space-between" style={{ gap: '4px' }}>
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={20} margin />
                  ) : currency ? (
                    <CurrencyLogo currency={currency} style={{ marginRight: '8px' }} />
                  ) : null}
                  {pair ? (
                    <Text id="pair" bold fontFamily="Inter">
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </Text>
                  ) : (
                    <Text id="pair" bold fontFamily="Inter" color="#fff">
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                            currency.symbol.length - 5,
                            currency.symbol.length,
                          )}`
                        : currency?.symbol) || t('Select a currency')}
                    </Text>
                    // <></>
                  )}
                  {!disableCurrencySelect && <ChevronDownIcon />}
                </Flex>
              </CurrencySelectButton>

              {token && tokenAddress ? (
                <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
                  <CopyButton
                    width="16px"
                    buttonColor="primary"
                    text={tokenAddress}
                    tooltipMessage={t('Token address copied')}
                    tooltipTop={-20}
                    tooltipRight={40}
                    tooltipFontSize={12}
                  />
                  <AddToWalletButton
                    variant="text"
                    p="0"
                    height="auto"
                    width="fit-content"
                    tokenAddress={tokenAddress}
                    tokenSymbol={token.symbol}
                    tokenDecimals={token.decimals}
                    tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
                  />
                </Flex>
              ) : null}
            </Flex>
          </LabelRow>

          <InputRow
            selected={disableCurrencySelect}
            style={{
              height: '100%',
              // paddingLeft: '15px',
              // border: '1px solid white',
              gap: '10px',
              flexWrap: 'wrap-reverse',

              marginTop: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 0,
            }}
          >
            <>
              <UserBalanceContainer>
                <WalletFilledIcon color="#2DFE87" />
                <Text
                  onClick={!disabled && onMax}
                  color="white"
                  // mb={3}
                  fontFamily="Inter"
                  fontSize="14px"
                  fontWeight={600}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency
                    ? t('%balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                </Text>
              </UserBalanceContainer>
            </>

            {account && currency && selectedCurrencyBalance?.greaterThan(0) && !disabled && label !== 'To' && (
              <Flex alignItems="right" justifyContent="end" flexWrap="wrap">
                {/*       {!!currency && showBUSD && (
                  <Flex justifyContent="flex-end" mr="1rem">
                    <Flex maxWidth="200px">
                      {Number.isFinite(amountInDollar) ? (
                        <Text fontSize="12px" color="textSubtle">
                          ~{formatNumber(amountInDollar)} USD
                        </Text>
                      ) : (
                        <Box height="18px" />
                      )}
                    </Flex>
                  </Flex>
                )}
                       */}

                {!!showBUSD && (
                  <Flex justifyContent="flex-end" mr="1rem">
                    <Flex maxWidth="200px">
                      {inputLoading ? (
                        <Loading width="14px" height="14px" />
                      ) : showBUSD && Number.isFinite(amountInDollar) ? (
                        <Text fontSize="12px" color="textSubtle" ellipsis>
                          {`~${formatNumber(amountInDollar)} USD`}
                        </Text>
                      ) : (
                        <Box height="18px" />
                      )}
                    </Flex>
                  </Flex>
                )}

                {showQuickInputButton &&
                  onPercentInput &&
                  [25, 50, 75].map((percent) => (
                    <Button
                      key={`btn_quickCurrency${percent}`}
                      onClick={() => {
                        onPercentInput(percent)
                      }}
                      scale="xs"
                      mr="5px"
                      variant="secondary"
                      style={{ textTransform: 'uppercase' }}
                    >
                      {percent}%
                    </Button>
                  ))}
                {showMaxButton && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onUserInput(selectedCurrencyBalance?.toSignificant(6).toString())
                    }}
                    scale="xs"
                    variant="secondary"
                    style={{ textTransform: 'uppercase' }}
                  >
                    {t('Max')}
                  </Button>
                )}
              </Flex>
            )}
          </InputRow>
        </Container>
        {disabled && <Overlay />}
      </InputPanel>
    </Box>
  )
}