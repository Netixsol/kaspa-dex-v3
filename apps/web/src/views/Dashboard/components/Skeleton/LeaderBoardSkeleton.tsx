import styled from 'styled-components'
import { Flex, Skeleton, Box } from '@pancakeswap/uikit'
import { DashBox } from '../../style'
import { ContentBox } from 'views/Dashboard/liquidityProvision'

const AvatarSkeleton = styled(Skeleton)`
  border-radius: 50%;
`

const LeaderBoardSkeleton = () => {
  return (
    <DashBox style={{ width: '100%', flexGrow: 5 }}>
      {/* Title and share button skeleton */}
      <Flex alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Skeleton width={150} height={32} />
        <Skeleton width={40} height={40} variant="circle" />
      </Flex>

      {/* Top 3 leaderboard skeleton */}
      <Box paddingTop="40px">
        <Flex justifyContent="space-between" alignItems="center">
          {/* 2nd place */}
          <Flex flexDirection="column" justifyContent="center" alignItems="center" style={{ gap: 10 }}>
            <AvatarSkeleton width={70} height={70} />
            <Box>
              <Skeleton width={80} height={20} margin="0 auto" />
              <Skeleton width={60} height={16} margin="4px auto 0" />
            </Box>
          </Flex>

          {/* 1st place */}
          <Flex flexDirection="column" justifyContent="center" alignItems="center" style={{ gap: 10 }}>
            <AvatarSkeleton width={90} height={90} />
            <Box>
              <Skeleton width={100} height={20} margin="0 auto" />
              <Skeleton width={80} height={16} margin="4px auto 0" />
            </Box>
          </Flex>

          {/* 3rd place */}
          <Flex flexDirection="column" justifyContent="center" alignItems="center" style={{ gap: 10 }}>
            <AvatarSkeleton width={70} height={70} />
            <Box>
              <Skeleton width={80} height={20} margin="0 auto" />
              <Skeleton width={60} height={16} margin="4px auto 0" />
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* List of other participants skeleton */}
      <Flex width="100%" flexDirection="column" marginTop="20px" style={{ gap: '10px' }}>
        {[...Array(7)].map((_, index) => (
          <ContentBox key={`skeleton-row-${index}`} style={{ padding: '0px' }}>
            <Flex justifyContent="space-between" alignItems="center" position="relative">
              {/* Position number */}
              <Box width="20%" position="relative" style={{ alignSelf: 'stretch', placeContent: 'center' }}>
                <Skeleton width={20} height={20} margin="0 auto" />
                <Box
                  position="absolute"
                  right="0"
                  top="50%"
                  style={{ transform: 'translateY(-50%)', height: '60%' }}
                  width="2px"
                  backgroundColor="#252136"
                />
              </Box>

              {/* User info */}
              <Flex
                style={{ gap: '10px' }}
                alignItems="center"
                width="40%"
                paddingX="16px"
                paddingY="10px"
                position="relative"
              >
                <AvatarSkeleton width={44} height={44} />
                <Skeleton width={80} height={20} />
                <Box
                  position="absolute"
                  right="0"
                  top="50%"
                  style={{ transform: 'translateY(-50%)', height: '60%' }}
                  width="2px"
                  backgroundColor="#252136"
                />
              </Flex>

              {/* Points */}
              <Box width="40%" paddingX="16px">
                <Skeleton width={80} height={16} />
              </Box>
            </Flex>
          </ContentBox>
        ))}
      </Flex>
    </DashBox>
  )
}

export default LeaderBoardSkeleton
