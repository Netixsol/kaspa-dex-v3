import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { SmartContractPhases, LIVE, REGISTRATION } from 'config/constants/trading-competition/phases'
import { useTradingCompetitionContractMoD } from 'hooks/useContract'

export const useCompetitionStatus = () => {
  // const tradingCompetitionContract = useTradingCompetitionContractMoD()

  // const { data: state } = useSWRImmutable('competitionStatus', async () => {
  //   const competitionStatus = await tradingCompetitionContract.read.currentStatus()
  //   return SmartContractPhases[competitionStatus].state
  // })

  // return useMemo(() => {
    // if (state === REGISTRATION) {
    //   return 'soon'
    // }

    // if (state === LIVE) {
    //   return 'live'
    // }

    return "soon"
  // }, [state])
}
