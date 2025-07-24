import styled from 'styled-components'
import { useState } from 'react'
import { Box } from '@pancakeswap/uikit'

// Types
interface ColumnConfig<T> {
  key: string
  header: string
  render?: (data: T) => React.ReactNode
  headerStyle?: React.CSSProperties
  cellStyle?: React.CSSProperties
}

interface TableProps<T> {
  data: T[]
  columns: ColumnConfig<T>[]
  itemsPerPage?: number
  sepratorColor?: string
  totalItems?: number // For server-side pagination
  onPageChange?: (page: number) => void // For server-side pagination
  serverSidePagination?: boolean // Flag to determine pagination mode
}

// Styled Components (unchanged)
const GridTable = styled.div<{ $column: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $column }) => $column}, 1fr);
  margin: 0 auto;
`

const HeaderCell = styled.div<{ $isFirst: boolean; $isLast: boolean }>`
  background-color: #252136;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 16px 0 16px 33px;
  position: relative;
  border-bottom: 1px solid #1fcd6d;
  border-top: 1px solid #1fcd6d;
  border-radius: ${({ $isFirst, $isLast }) => ($isFirst ? '10px 0 0 10px' : $isLast ? '0 10px 10px 0' : '0')};

  border-left: ${({ $isFirst }) => ($isFirst ? '1px solid #1fcd6d' : 'none')};
  border-right: ${({ $isLast }) => ($isLast ? '1px solid #1fcd6d' : 'none')};

  &:not(:first-child)::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 2px;
    background-color: #1fcd6d;
  }
`

const BodyRow = styled.div<{ $bgColor: string }>`
  display: contents;

  & > div {
    padding: 16px 33px 16px 33px;
    font-size: 16px;
    font-weight: 400;
    margin-top: 20px;
    background: #252136;
    position: relative;

    &:not(:first-child)::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 60%;
      width: 2px;
      background-color: ${({ $bgColor }) => $bgColor};
    }
  }
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 8px;
`

const PageNumber = styled.button<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#1FCD6D' : '#252136')};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? '#1FCD6D' : '#3a3655')};
  }
`
const ResponsiveTableBox = styled(Box)`
  overflow-x: auto;
  overflow-y: visible;
  padding-bottom: 10px;
`
// Component
const DynamicTable = <T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 5,
  sepratorColor,
  totalItems, // For server-side pagination
  onPageChange, // Callback for server-side pagination
  serverSidePagination = false, // Default to client-side
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination values based on mode
  const totalPages = serverSidePagination
    ? Math.ceil((totalItems || 0) / itemsPerPage)
    : Math.ceil((data?.length || 0) / itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (serverSidePagination && onPageChange) {
      onPageChange(page)
    }
  }

  // For client-side pagination, slice the data
  const paginatedData = serverSidePagination
    ? data
    : data === undefined
    ? []
    : data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <ResponsiveTableBox>
      <GridTable $column={columns.length}>
        {/* Header */}
        {columns.map((column, index) => (
          <HeaderCell
            key={`header-${column.key}`}
            $isFirst={index === 0}
            $isLast={index === columns.length - 1}
            style={column.headerStyle}
          >
            {column.header}
          </HeaderCell>
        ))}

        {/* Body */}
        {paginatedData?.map((item) => (
          <BodyRow key={`row-${item.id}`} $bgColor={sepratorColor || '#120f1f'}>
            {columns.map((column, colIndex) => (
              <div
                key={`cell-${item.id}-${column.key}`}
                style={{
                  borderRadius:
                    colIndex === 0 ? '10px 0 0 10px' : colIndex === columns.length - 1 ? '0 10px 10px 0' : '0',
                  ...column.cellStyle,
                }}
              >
                {column.render ? column.render(item) : item[column.key]}
              </div>
            ))}
          </BodyRow>
        ))}
      </GridTable>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationContainer>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageNumber key={i + 1} $active={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </PageNumber>
          ))}
        </PaginationContainer>
      )}
    </ResponsiveTableBox>
  )
}

export default DynamicTable
