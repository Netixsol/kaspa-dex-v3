import { useTranslation } from '@pancakeswap/localization'
import { FC, useCallback } from 'react'

import CurrencyInputHeader from '../../components/CurrencyInputHeader'
import dynamic from 'next/dynamic'
import infoData from '../../components/info.json'

const HoverLottie = dynamic(() => import('components/Menu/GlobalSettings/HoverLottie'), { ssr: false })
export const FormHeader: FC<{ refreshDisabled: boolean; onRefresh: () => void; setInfoState: any; info: boolean }> = ({
  refreshDisabled,
  onRefresh,
  setInfoState,
  info,
}) => {
  const { t } = useTranslation()

  const handleRefresh = useCallback(() => {
    if (refreshDisabled) {
      return
    }
    onRefresh()
  }, [onRefresh, refreshDisabled])

  return (
    <>
      <CurrencyInputHeader
        title={t('Swap')}
        subtitle={t('Trade tokens in an instant')}
        hasAmount={!refreshDisabled}
        onRefreshPrice={handleRefresh}
        info={
          <>
            <HoverLottie
              onClick={() => setInfoState(!info)}
              animationData={infoData}
              style={{
                height: '26px',
                color: '#fff',
                cursor: 'pointer',
              }}
            />
          </>
        }
        setInfoState={setInfoState}
      />
    </>
  )
}
