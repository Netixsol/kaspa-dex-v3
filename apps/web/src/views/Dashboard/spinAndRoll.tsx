import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useSpin from 'hooks/useSpin'
import { Box, Button, Flex, Heading, IconButton, Text } from '@pancakeswap/uikit'
import { SpinWheel } from './components/SpinWheel'
import SpinHistory from './components/SpinHistory'
import TickIcon from './icons/tick.ico'
import { WinnerIcon } from './icons/winner.ico'
import { useMadeSpinReward } from './hooks/useMadeSpinReward'
import SpinnerLoader from './components/shared/SpinnerLoader'
import { useSpinHistory } from './hooks/useSpinHistory'
import moment from 'moment'
import getCountdownFromNow from 'utils/getCountdownFromNow'
import { ShareIcon } from './icons/share.ico'
import { useRewardPoints } from './hooks/useRewardPoints'

const SpinAndRoll = () => {
  const [disableButton, setdisableButton] = useState<boolean>(false)
  const [countdown, setCountdown] = useState('')
  const [isSpinAvailable, setIsSpinAvailable] = useState(true)
  const {
    selectedItem,
    initState,
    randIndex,
    items,
    spinTime,
    spinNow,
    isFinished,
    fetchSpinHistory,
    setFetchSpinHistory,
  } = useSpin()
  const { data, mutate, error } = useSpinHistory()
  const { mutateAsync, isLoading, isError } = useMadeSpinReward()
  const { mutate:mutateRewardPoints } = useRewardPoints();

  const historyData = data?.data?.history
  const latestSpin = historyData?.[0]

  const submitSpin = async () => {
    setdisableButton(true)

    const selected = spinNow()

    try {
      const res = await mutateAsync({ points: selected })
    } catch (err) {
      console.error('Error submitting spin reward', err)
    }
  }

  useEffect(() => {
    if (latestSpin?.next_spin_date == null) return

    const updateCountdown = () => {
      const target = latestSpin.next_spin_date
      const rewardDate = moment.utc()
      const isAvailable = rewardDate.isSameOrAfter(target)
      setIsSpinAvailable(isAvailable)

      setCountdown(getCountdownFromNow(latestSpin.next_spin_date))
    }
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [latestSpin])

  useEffect(() => {
    if (fetchSpinHistory) {
      mutate();
      mutateRewardPoints();
      setFetchSpinHistory(false)
    }
  }, [fetchSpinHistory, mutate])

  return (
    <Flex flexDirection="column" style={{ gap: '24px' }} flexWrap="wrap">
      <Flex style={{ justifyContent: 'space-between' }}>
        <Heading scale="xxl">Spin & Roll Your Daily Bonus</Heading>
        <Flex>
          <IconButton width="48px" height="48px" style={{ padding: '12px', borderRadius: "100%" }}>
            <ShareIcon color="#120F1F" width="24" height="22" viewBox="0 0 24 22" fill="none" />
          </IconButton>
        </Flex>
      </Flex>

      <Flex style={{ gap: '20px' }} flexWrap={'wrap'}>
        <Flex background="#252136" borderRadius="16px" padding="25px" justifyContent="space-between" flexGrow={2}>
          <Grid>
            <Box>
              <DailySpinHeading>Daily Spin</DailySpinHeading>
              <SpinWheel
                selectedItem={selectedItem}
                initState={initState}
                randIndex={randIndex}
                items={items}
                spinTime={spinTime}
              />
            </Box>

            <Box style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <DailySpinHeading>Points Earned</DailySpinHeading>
              <ContentBox>
                <Flex justifyContent="space-between">
                  <Text fontSize="24px" fontWeight={500} color="#1FD26F">
                    {isSpinAvailable
                      ? 0
                      : selectedItem
                      ? selectedItem
                      : latestSpin?.points_awarded
                      ? latestSpin?.points_awarded
                      : 0}
                  </Text>
                  <Flex justifyContent="center" alignItems="center">
                    {!isLoading && isFinished && !isSpinAvailable && (
                      <Flex
                        width={28}
                        height={28}
                        borderRadius="100%"
                        background="#1FD26F"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <TickIcon width={14} height={10} fill="none" />
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </ContentBox>

              <Flex style={{ width: '100%', justifyContent: 'center' }}>
                <WinnerIcon />
              </Flex>
              <Flex style={{ width: '100%', justifyContent: 'center', fontSize: '16px' }}>
                <Text>
                  Spin the wheel to win <span style={{ color: '#1FD26F' }}>500 to 2500 Points</span>
                </Text>
              </Flex>

              <Flex style={{ width: '100%', justifyContent: 'center', fontSize: '16px' }}>
                <Button
                  onClick={() => {
                    submitSpin()
                  }}
                  type="button"
                  style={{
                    border: '1px solid #1FD26F',
                    background: 'none',
                    width: '100%',
                    height: '40px',
                  }}
                  disabled={!isFinished || isLoading || disableButton || !isSpinAvailable || isError || error}
                >
                  {isLoading || !isFinished ? (
                    <SpinnerLoader bg="#fff" color="#1FD26F" size={26} borderWidth={4} />
                  ) : (
                    'Spin Now'
                  )}
                </Button>
              </Flex>

              <Flex style={{ width: '100%', justifyContent: 'center', fontSize: '14px' }}>
                <Text style={{ width: '270px' }}>
                  Next Free Spin:{' '}
                  <span style={{ color: '#1FD26F', padding: '0px 5px' }}>{countdown ? countdown : '00-00-00'}</span>
                </Text>
              </Flex>
            </Box>
          </Grid>
        </Flex>

        <Flex style={{ flex: '1' }}>
          <SpinHistory data={data} />
        </Flex>
      </Flex>
    </Flex>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
`

const DailySpinHeading = styled.div`
  font-size: 24px;
  font-weight: 500;
`

export const ContentBox = styled(Box)`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  padding: 15px 25px;
  font-size: 24px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
`

export default SpinAndRoll
