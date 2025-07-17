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
}

// Styled Components
const GridTable = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  width: 100%;
  /* max-width: 1200px; */
  margin: 0 auto;
`

const HeaderCell = styled.div<{ $isFirst: boolean; $isLast: boolean }>`
  background-color: #252136;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 16px 0 16px 33px;
  position: relative;
  border-radius: ${({ $isFirst, $isLast }) => ($isFirst ? '10px 0 0 10px' : $isLast ? '0 10px 10px 0' : '0')};

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

const BodyRow = styled.div`
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
      background-color: #120f1f;
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

// Component
const DynamicTable = <T extends Record<string, any>>({ data, columns, itemsPerPage = 5 }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

  return (
    <Box height="100%">
      <GridTable style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
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
        {paginatedData.map((item) => (
          <BodyRow key={`row-${item.id}`}>
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
            <PageNumber key={i + 1} $active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </PageNumber>
          ))}
        </PaginationContainer>
      )}
    </Box>
  )
}

export default DynamicTable
