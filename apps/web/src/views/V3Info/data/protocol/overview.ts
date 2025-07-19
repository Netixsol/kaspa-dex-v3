import BigNumber from 'bignumber.js'
import { gql, GraphQLClient } from 'graphql-request'
import { Block } from 'state/info/types'
import { ProtocolData } from '../../types'
import { getPercentChange } from '../../utils/data'

export const GLOBAL_DATA = (block?: string | number) => {
  const queryString = ` query pools {
    factories(
      ${block !== undefined ? `block: { number: ${block}}` : ``} 
       first: 1) {
        txCount
        totalVolumeUSD
        totalFeesUSD
        totalValueLockedUSD
      }
    }`
  return gql`
    ${queryString}
  `
}

interface Pool {
  txCount: string | number
  totalVolumeUSD: string | number
  totalFeesUSD: string | number
  totalValueLockedUSD: string | number
}

interface GlobalResponse {
  factories: Pool[]
}

export async function fetchProtocolData(
  dataClient: GraphQLClient,
  blocks: Block[],
): Promise<{
  error: boolean
  data: ProtocolData | undefined
}> {
  try {
    const [block24, block48] = blocks ?? []
    // fetch all data
    const data = await dataClient.request<GlobalResponse>(GLOBAL_DATA())

    const data24 = await dataClient.request<GlobalResponse>(GLOBAL_DATA(block24?.number ?? 0))

    const data48 = await dataClient.request<GlobalResponse>(GLOBAL_DATA(block48?.number ?? 0))

    console.log("objects::::", data, data24, data48);

    const parsed: Pool = data?.factories?.reduce(
      (acc, pool) => ({
        totalFeesUSD: Number(acc.totalFeesUSD) + Number(pool.totalFeesUSD),
        txCount: Number(acc.txCount) + Number(pool.txCount),
        totalVolumeUSD: Number(acc.totalVolumeUSD) + Number(pool.totalVolumeUSD),
        totalValueLockedUSD: Number(acc.totalValueLockedUSD) + Number(pool.totalValueLockedUSD),
      }),
      { totalFeesUSD: 0, txCount: 0, totalVolumeUSD: 0, totalValueLockedUSD: 0 },
    )
    const parsed24: Pool = data24?.factories?.reduce(
      (acc, pool) => ({
        totalFeesUSD: Number(acc.totalFeesUSD) + Number(pool.totalFeesUSD),
        txCount: Number(acc.txCount) + Number(pool.txCount),
        totalVolumeUSD: Number(acc.totalVolumeUSD) + Number(pool.totalVolumeUSD),
        totalValueLockedUSD: Number(acc.totalValueLockedUSD) + Number(pool.totalValueLockedUSD),
      }),
      { totalFeesUSD: 0, txCount: 0, totalVolumeUSD: 0, totalValueLockedUSD: 0 },
    )
    const parsed48: Pool = data48?.factories?.reduce(
      (acc, pool) => ({
        totalFeesUSD: Number(acc.totalFeesUSD) + Number(pool.totalFeesUSD),
        txCount: Number(acc.txCount) + Number(pool.txCount),
        totalVolumeUSD: Number(acc.totalVolumeUSD) + Number(pool.totalVolumeUSD),
        totalValueLockedUSD: Number(acc.totalValueLockedUSD) + Number(pool.totalValueLockedUSD),
      }),
      { totalFeesUSD: 0, txCount: 0, totalVolumeUSD: 0, totalValueLockedUSD: 0 },
    )

    // volume data
    const volumeUSD =
      parsed && parsed24
        ? parseFloat(parsed.totalVolumeUSD as string) - parseFloat(parsed24.totalVolumeUSD as string)
        : parseFloat(parsed.totalVolumeUSD as string)

    const volumeOneWindowAgo =
      parsed24?.totalVolumeUSD && parsed48?.totalVolumeUSD
        ? parseFloat(parsed24.totalVolumeUSD as string) - parseFloat(parsed48.totalVolumeUSD as string)
        : undefined

    const volumeUSDChange =
      volumeUSD && volumeOneWindowAgo ? ((volumeUSD - volumeOneWindowAgo) / volumeOneWindowAgo) * 100 : 0

    // total value locked
    const tvlUSDChange = getPercentChange(
      parsed?.totalValueLockedUSD as string,
      parsed24?.totalValueLockedUSD as string,
    )

    // 24H transactions
    const txCount =
      parsed && parsed24
        ? parseFloat(parsed.txCount as string) - parseFloat(parsed24.txCount as string)
        : parseFloat(parsed.txCount as string)

    const txCountOneWindowAgo =
      parsed24 && parsed48 ? parseFloat(parsed24.txCount as string) - parseFloat(parsed48.txCount as string) : undefined

    const txCountChange =
      txCount && txCountOneWindowAgo ? getPercentChange(txCount.toString(), txCountOneWindowAgo.toString()) : 0

    const feesOneWindowAgo =
      parsed24 && parsed48
        ? new BigNumber(parsed24.totalFeesUSD).minus(new BigNumber(parsed48.totalFeesUSD))
        : undefined

    const totalFeesUSD =
      parsed && parsed24
        ? new BigNumber(parsed.totalFeesUSD).minus(new BigNumber(parsed24.totalFeesUSD))
        : new BigNumber(parsed.totalFeesUSD)

    const feeChange =
      totalFeesUSD && feesOneWindowAgo ? getPercentChange(totalFeesUSD.toString(), feesOneWindowAgo.toString()) : 0

    const formattedData = {
      volumeUSD,
      volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
      tvlUSD: parseFloat(parsed?.totalValueLockedUSD as string),
      tvlUSDChange,
      feesUSD: totalFeesUSD.toNumber(),
      feeChange,
      txCount,
      txCountChange,
    }

    return {
      error: false,
      data: formattedData,
    }
  } catch (e) {
    console.error(e)
    return {
      error: false,
      data: undefined,
    }
  }
}
