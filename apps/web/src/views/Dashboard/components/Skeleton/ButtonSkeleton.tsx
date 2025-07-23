import { Skeleton } from '@pancakeswap/uikit'

export const ButtonSkeleton = ({ ...props }) => {
  return <Skeleton width="100%" height={48} {...props} />
}
