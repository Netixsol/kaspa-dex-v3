import Numeral from 'numeral'

export const formatLongNumber = (num: string, usd?: boolean): string => {
  return usd ? `$${Numeral(num).format('0,0')}` : Numeral(num).format('0,0')
}

export const formatTokenBalance = (balance: number): string => {
  if (balance === 0) {
    return '0'
  }

  if (balance > 0 && balance < 1) {
    return balance.toPrecision(3)
  }

  return balance.toFixed(3)
}

// export function useCurrencyConvertedToNative(currency?: Currency): Currency | undefined {
//   return useMemo(() => {
//     if (!!currency) {
//       return currency.isNative ? NativeCurrencies[currency.chainId] : currency
//     }
//     return undefined
//   }, [currency])
// }

const formatDollarFractionAmount = (num: number, digits: number) => {
  const formatter = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return formatter.format(num)
}

export const toK = (num: string) => {
  return Numeral(num).format('0.[00]a')
}
export function formattedNum(number: string, usd = false, fractionDigits = 5) {
  if (number === '' || number === undefined) {
    return usd ? '$0' : 0
  }

  const num = parseFloat(number)

  if (num > 500000000) {
    return (usd ? '$' : '') + toK(num.toFixed(0))
  }

  if (num >= 1000) {
    return usd ? formatDollarFractionAmount(num, 0) : Number(num.toFixed(0)).toLocaleString()
  }

  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (num < 0.0001) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (usd) {
    if (num < 0.1) {
      return formatDollarFractionAmount(num, 4)
    }
    return formatDollarFractionAmount(num, 2)
  }

  // this function can be replaced when `roundingMode` of `Intl.NumberFormat` is widely supported
  // this function is to avoid this case
  // 0.000297796.toFixed(6) = 0.000298
  // truncateFloatNumber(0.000297796) = 0.000297
  return truncateFloatNumber(num, fractionDigits)
}
function truncateFloatNumber(num: number, fractionDigits: number) {
  const numStr = num.toString()
  const dotIndex = numStr.indexOf('.')
  if (dotIndex === -1) {
    return numStr
  }
  return numStr.slice(0, dotIndex + fractionDigits + 1)
}
