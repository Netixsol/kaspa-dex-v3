import { useTranslation } from '@pancakeswap/localization'
import { Button, IfoGetTokenModal, useModal, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Ifo, PoolIds } from 'config/constants/types'
import { useCurrencyBalance } from 'hooks/Balances'
import { useMemo } from 'react'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'
import ContributeModal from './ContributeModal'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const ContributeButton: React.FC<React.PropsWithChildren<Props>> = ({ poolId, ifo, publicIfoData, walletIfoData }) => {
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]
  const { isPendingTx, amountTokenCommittedInLP } = userPoolCharacteristics
  const { limitPerUserInLP } = publicPoolCharacteristics
  const { t } = useTranslation()
  const getNow = useLedgerTimestamp()
  const { toastSuccess } = useToast()
  const currencyBalance = useCurrencyBalance(ifo.currency.address)
  const { startTime, endTime } = publicIfoData

  const currentTime = getNow() / 1000

  const status = getStatus(currentTime, startTime, endTime)

  const balance = useMemo(
    () => (currencyBalance ? new BigNumber(currencyBalance.quotient.toString()) : BIG_ZERO),
    [currencyBalance],
  )

  // Refetch all the data, and display a message when fetching is done
  const handleContributeSuccess = async (amount: BigNumber, txHash: string) => {
    toastSuccess(
      t('Success!'),
      <ToastDescriptionWithTx txHash={txHash}>
        {t('You have contributed %amount% KFC to this IFO!', {
          amount: getBalanceNumber(amount, ifo.currency.decimals),
        })}
      </ToastDescriptionWithTx>,
    )
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      poolId={poolId}
      ifo={ifo}
      publicIfoData={publicIfoData}
      walletIfoData={walletIfoData}
      onSuccess={handleContributeSuccess}
      userCurrencyBalance={balance}
    />,
    false,
  )

  const [onPresentGetTokenModal] = useModal(
    <IfoGetTokenModal
      symbol={ifo.currency.symbol}
      address={ifo.currency.address}
      imageSrc={`https://tokens.pancakeswap.finance/images/aptos/${ifo.currency.address}.png`}
    />,
    false,
  )

  const noNeedCredit = true

  const isMaxCommitted =
    !noNeedCredit ||
    (limitPerUserInLP.isGreaterThan(0) && amountTokenCommittedInLP.isGreaterThanOrEqualTo(limitPerUserInLP))

  const isDisabled = isPendingTx || isMaxCommitted || status !== 'live'

  return (
    <Button
      onClick={balance.isEqualTo(0) ? onPresentGetTokenModal : onPresentContributeModal}
      width="100%"
      disabled={isDisabled}
    >
      {/* TODO: Text should support another token. */}
      {isMaxCommitted && status === 'live' ? t('Max. Committed') : t('Commit KFC')}
    </Button>
  )
}

export default ContributeButton
