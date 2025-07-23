import styled from 'styled-components'
import { Skeleton, Box, Flex } from '@pancakeswap/uikit'

const TableSkeletonContainer = styled(Box)`
  width: 100%;
`

const SkeletonHeaderCell = styled(Skeleton)`
  height: 56px;
  border-radius: 10px;
  margin-bottom: 8px;
`

const SkeletonRowCell = styled(Skeleton)`
  height: 56px;
  border-radius: 10px;
  margin-bottom: 8px;
`

const SkeletonPagination = styled(Skeleton)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`

export const TableSkeleton = ({ columns = 3, rows = 5 }) => {
  return (
    <TableSkeletonContainer>
      {/* Header skeleton */}
      <Flex justifyContent="space-between" mb="8px">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonHeaderCell key={`header-${i}`} width="100%" />
        ))}
      </Flex>

      {/* Body skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Flex key={`row-${rowIndex}`} justifyContent="space-between" mb="8px">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonRowCell
              key={`cell-${rowIndex}-${colIndex}`}
              width="100%"
              borderRadius={colIndex === 0 ? '10px 0 0 10px' : colIndex === columns - 1 ? '0 10px 10px 0' : '0'}
            />
          ))}
        </Flex>
      ))}

      {/* Pagination skeleton */}
      <Flex justifyContent="center" mt="30px" style={{ gap: '8px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonPagination key={`page-${i}`} />
        ))}
      </Flex>
    </TableSkeletonContainer>
  )
}

export const EarningHistoryTableSkeleton = () => {
  return <TableSkeleton columns={3} rows={8} />
}
