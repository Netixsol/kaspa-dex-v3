import { Flex, Skeleton } from '@pancakeswap/uikit'
import { ContentBox } from 'views/Dashboard/spinAndRoll'
import { DashBox } from 'views/Dashboard/style'
import { ButtonSkeleton } from './ButtonSkeleton'
import styled from 'styled-components'

export const DashBoxSkeleton = styled(DashBox)`
  width: 100%;
`
export const GainRewardSkeleton = ({ numberOfRewards = 2, isPoints = true, isButton = false }) => {
  return (
    <DashBoxSkeleton>
      <Flex flexDirection="column" height="100%">
        <Skeleton width={200} height={32} marginBottom="20px" />
        <Flex flexDirection="column" marginTop="20px" style={{ gap: '10px' }} flex={1}>
          {[...Array(numberOfRewards)].map((_, i) => (
            <ContentBox key={`init-skel-${i}`}>
              <Flex justifyContent="space-between" width="100%">
                <Skeleton width={100} height={20} />
                <Flex width="40%" justifyContent="end" alignItems="center">
                  {isPoints && <Skeleton width={80} marginRight="auto" height={20} />}
                  <Skeleton width={28} height={28} variant="circle" />
                </Flex>
              </Flex>
            </ContentBox>
          ))}
          {isButton && <ButtonSkeleton marginTop="auto" />}
        </Flex>
      </Flex>
    </DashBoxSkeleton>
  )
}
