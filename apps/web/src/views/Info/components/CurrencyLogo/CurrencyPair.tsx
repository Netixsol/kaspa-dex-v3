import { Token } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { multiChainId, MultiChainName, MultiChainNameExtend } from 'state/info/constant'
import styled from 'styled-components'
import getTokenLogoURL from '../../../../utils/getTokenLogoURL'
import LogoLoader from './LogoLoader'

const StyledLogo = styled(LogoLoader)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  position: absolute;
  left: 17px;
`
const StyledLogo2 = styled(LogoLoader)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  /* border: 2px solid white; */

  position: relative;
`

export const CurrencyLogo: React.FC<
  React.PropsWithChildren<{
    address?: string
    size?: string
    chainName?: MultiChainNameExtend
  }>
> = ({ address, size = '24px', chainName = 'BSC', ...rest }) => {
  const src = useMemo(() => {
    // @ts-ignore
    return getTokenLogoURL(new Token(multiChainId[chainName], address, 18, ''))
  }, [address, chainName])

  return <StyledLogo size={size} src={src} alt="token logo" {...rest} />
}
export const CurrencyLogo2: React.FC<
  React.PropsWithChildren<{
    address?: string
    size?: string
    chainName?: MultiChainNameExtend
  }>
> = ({ address, size = '24px', chainName = 'BSC', ...rest }) => {
  const src = useMemo(() => {
    // @ts-ignore
    return getTokenLogoURL(new Token(multiChainId[chainName], address, 18, ''))
  }, [address, chainName])

  // console.log('logo...', src, address, chainName)
  return <StyledLogo2 size={size} src={src} alt="token logo" {...rest} />
}
const DoubleCurrencyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  width: 32px;
`

interface DoubleCurrencyLogoProps {
  address0?: string
  address1?: string
  size?: number
  chainName?: MultiChainNameExtend
}

export const CurrencyPair: React.FC<React.PropsWithChildren<DoubleCurrencyLogoProps>> = ({
  address0,
  address1,
  size = 30,
  chainName = 'KASPLEX_TESTNET',
}) => {
  return (
    <DoubleCurrencyWrapper>
      {address0 && <CurrencyLogo address={address1} size={`${size.toString()}px`} chainName={chainName} />}
      {address1 && <CurrencyLogo2 address={address0} size={`${size.toString()}px`} chainName={chainName} />}
    </DoubleCurrencyWrapper>
  )
}
