import styled from 'styled-components'

const Table = styled.table`
  background-color: red;

  th,
  td {
    margin: 0;
    padding: 7px;
    border-right: 1px solid #aaa;
    border-bottom: 1px solid #aaa;
    text-align: left;

    &:first-child {
      border-left: 1px solid #aaa;
    }
  }

  th {
    border-top: 1px solid #aaa;
  }
`
const StyledTableHeader = styled.thead`
  background-color: #eeeeee;
`

const MigrationLpTable = () => {
  return (
    <>
      <Table>
        <StyledTableHeader />
      </Table>
    </>
  )
}

export default MigrationLpTable
