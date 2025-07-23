import { Flex, Skeleton } from '@pancakeswap/uikit'
import { ProgressBarSkeleton } from './ProgressBar'
import { DashBoxSkeleton } from './GainRewardSkeleton'

export const GraphContainerSkeleton = () => {
  return (
    <DashBoxSkeleton>
      <Flex flexDirection="column" height="100%" width="100%">
        <Skeleton width={200} height={32} marginBottom="20px" />
        <ProgressBarSkeleton size={250} />
        <Skeleton width="100%" height={60} marginTop="40px" borderRadius="8px" />
      </Flex>
    </DashBoxSkeleton>
  )
}
