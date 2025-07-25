import { IPendingCakeByTokenId, PositionDetails } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/swap-sdk-core'
import { AtomBox, AtomBoxProps } from '@pancakeswap/ui'
import {
  AutoColumn,
  Button,
  Farm as FarmUI,
  Flex,
  Modal,
  ModalV2,
  RowBetween,
  StyledTooltip,
  Text,
  useModalV2,
} from '@pancakeswap/uikit'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { isPositionOutOfRange } from '@pancakeswap/utils/isPositionOutOfRange'
import { Pool } from '@pancakeswap/v3-sdk'
import { BigNumber } from 'bignumber.js'
import { LightCard } from 'components/Card'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import Image from 'next/image'
import NextLink from 'next/link'
import { useMemo } from 'react'
import { usePriceCakeUSD } from 'state/farms/hooks'
import styled, { useTheme } from 'styled-components'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import { V3Farm } from 'views/Farms/FarmsV3'
import useFarmV3Actions from 'views/Farms/hooks/v3/useFarmV3Actions'
import { RangeTag } from 'components/RangeTag'
import FarmV3StakeAndUnStake, { FarmV3LPPosition, FarmV3LPPositionDetail, FarmV3LPTitle } from './FarmV3StakeAndUnStake'

const { FarmV3HarvestAction } = FarmUI.FarmV3Table

const ActionContainer = styled(Flex)`
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  flex-wrap: wrap;
  padding: 16px;
  gap: 24px;
`

const Arrow = styled.div`
  position: absolute;
  top: 0px;
  transform: translate3d(0px, 62px, 0px);
  right: 4px;
  &::before {
    content: '';
    transform: rotate(45deg);
    background: var(--colors-backgroundAlt);
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    z-index: -1;
  }
`

ActionContainer.defaultProps = {
  bg: 'dropdown',
}

type PositionType = 'staked' | 'unstaked'

interface SingleFarmV3CardProps {
  farm: V3Farm
  pool?: Pool
  lpSymbol: string
  position: PositionDetails
  positionType: PositionType
  token: Token
  quoteToken: Token
  pendingCakeByTokenIds: IPendingCakeByTokenId
  onDismiss?: () => void
  direction?: 'row' | 'column'
  harvesting?: boolean
}

const SingleFarmV3Card: React.FunctionComponent<
  React.PropsWithChildren<SingleFarmV3CardProps & Omit<AtomBoxProps, 'position'>>
> = ({
  farm,
  pool,
  lpSymbol,
  position,
  token,
  quoteToken,
  positionType,
  pendingCakeByTokenIds,
  onDismiss,
  direction = 'column',
  harvesting,
  ...atomBoxProps
}) => {
    const { chainId } = useActiveChainId()
    const { t } = useTranslation()
    const cakePrice = usePriceCakeUSD()
    const { tokenId } = position
    const isDark = true

    const title = `${lpSymbol} (#${tokenId.toString()})`
    const liquidityUrl = `/liquidity/${tokenId.toString()}?chain=${CHAIN_QUERY_NAME[chainId]}`

    const { onStake, onUnstake, onHarvest, attemptingTxn } = useFarmV3Actions({
      tokenId: tokenId.toString(),
    })

    const unstakedModal = useModalV2()

    const handleStake = async () => {
      await onStake()
      if (!attemptingTxn) {
        onDismiss?.()
      }
      logGTMClickStakeFarmEvent()
    }

    const handleStakeInactivePosition = () => {
      unstakedModal.onOpen()
    }

    const handleUnStake = async () => {
      await onUnstake()
      if (!attemptingTxn) {
        unstakedModal.onDismiss()
      }
    }

    const handleHarvest = async () => {
      await onHarvest()
      if (!attemptingTxn) {
        onDismiss?.()
      }
    }

    const outOfRange = isPositionOutOfRange(pool?.tickCurrent, position)
    const outOfRangeUnstaked = outOfRange && positionType === 'unstaked'

    const totalEarnings = useMemo(
      () => +formatBigInt(pendingCakeByTokenIds[position.tokenId.toString()] || 0n, 4),
      [pendingCakeByTokenIds, position.tokenId],
    )

    const earningsBusd = useMemo(() => {
      return new BigNumber(totalEarnings).times(cakePrice.toString()).toNumber()
    }, [cakePrice, totalEarnings])

    return (
      <AtomBox {...atomBoxProps}>
        <ActionContainer bg="background" flexDirection={direction}>
          <RowBetween
            flexDirection="column"
            alignItems="flex-start"
            flex={{
              xs: 'auto',
              md: 1,
            }}
          >
            <FarmV3StakeAndUnStake
              title={title}
              farm={farm}
              outOfRange={outOfRange}
              position={position}
              token={token}
              quoteToken={quoteToken}
              positionType={positionType}
              liquidityUrl={liquidityUrl}
              isPending={attemptingTxn || harvesting}
              handleStake={outOfRangeUnstaked ? handleStakeInactivePosition : handleStake}
              handleUnStake={unstakedModal.onOpen}
            />
            <ModalV2 {...unstakedModal} closeOnOverlayClick>
              <Modal
                title={outOfRangeUnstaked ? t('Staking') : t('Unstaking')}
                width={['100%', '100%', '420px']}
                maxWidth={['100%', , '420px']}
              >
                <AutoColumn gap="16px">
                  <AtomBox
                    position="relative"
                    style={{
                      minHeight: '96px',
                    }}
                  >
                    <AtomBox
                      style={{
                        position: 'absolute',
                        right: 0,
                        bottom: '-23px',
                        display: 'flex',
                      }}
                    >
                      <StyledTooltip
                        data-theme={isDark ? 'light' : 'dark'}
                        style={{
                          maxWidth: '160px',
                          position: 'relative',
                          color: "black"
                        }}
                      >
                        {outOfRangeUnstaked ? (
                          <>
                            {t('Inactive positions will')}
                            <b> {t('NOT')} </b>
                            {t('earn KFC rewards from farm.')}
                          </>
                        ) : (
                          t('You may add or remove liquidity on the position detail page without unstake')
                        )}
                        <Arrow />
                      </StyledTooltip>
                      <div style={{
                        position: 'relative',
                        width: '135px',
                        height: '120px',
                        overflow: 'hidden',
                      }}>
                        <Image
                          src="/images/decorations/KF_05.png"
                          alt="bulb bunny reminds unstaking"
                          height={100}
                          width={120}
                          style={{
                            objectFit: 'cover',
                            transform: 'scaleX(-1)',
                            marginTop: "10px"// 🔄 rotate the image
                          }}
                        />
                      </div>

                    </AtomBox>
                  </AtomBox>
                  <LightCard>
                    <AutoColumn gap="8px">
                      {outOfRange && (
                        <RangeTag outOfRange ml={0} style={{ alignItems: 'center', width: 'fit-content' }}>
                          {t('Inactive')}
                        </RangeTag>
                      )}
                      <FarmV3LPTitle title={title} liquidityUrl={liquidityUrl} outOfRange={outOfRange} />
                      <FarmV3LPPosition token={token} quoteToken={quoteToken} position={position} />
                      <FarmV3LPPositionDetail
                        token={token}
                        quoteToken={quoteToken}
                        position={position}
                        farm={farm}
                        positionType={positionType}
                      />
                      <NextLink href={liquidityUrl} onClick={unstakedModal.onDismiss}>
                        {outOfRangeUnstaked ? (
                          <Button
                            external
                            variant="primary"
                            width="100%"
                            as="a"
                            href={liquidityUrl}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            {t('View Position')}
                          </Button>
                        ) : (
                          <Button variant="tertiary" width="100%" as="a">
                            {t('Manage Position')}
                          </Button>
                        )}
                      </NextLink>
                    </AutoColumn>
                  </LightCard>
                  <Button
                    variant={outOfRangeUnstaked ? 'subtle' : 'primary'}
                    onClick={outOfRangeUnstaked ? handleStake : handleUnStake}
                    disabled={attemptingTxn || harvesting}
                    width="100%"
                  >
                    {outOfRangeUnstaked ? t('Continue Staking') : t('Unstake')}
                  </Button>
                  {outOfRangeUnstaked ? null : (
                    <Text color="textSubtle">
                      {t(
                        'Unstake will also automatically harvest any earnings that you haven’t collected yet, and send them to your wallet.',
                      )}
                    </Text>
                  )}
                </AutoColumn>
              </Modal>
            </ModalV2>
          </RowBetween>
          {positionType !== 'unstaked' && (
            <>
              <AtomBox
                border="1"
                width={{
                  xs: '100%',
                  md: 'auto',
                }}
              />
              <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="100%">
                <FarmV3HarvestAction
                  earnings={totalEarnings}
                  earningsBusd={earningsBusd}
                  pendingTx={attemptingTxn || harvesting}
                  disabled={!pendingCakeByTokenIds?.[position.tokenId.toString()] ?? true}
                  userDataReady
                  handleHarvest={handleHarvest}
                />
              </RowBetween>
            </>
          )}
        </ActionContainer>
      </AtomBox>
    )
  }

export default SingleFarmV3Card
