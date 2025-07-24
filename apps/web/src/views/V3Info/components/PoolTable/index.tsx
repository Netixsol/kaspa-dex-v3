import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ChevronLeftIcon, ChevronRightIcon, Flex, SortArrowIcon, Text } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import React, { useCallback, useMemo, useState } from 'react'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import styled from 'styled-components'
import { CurrencyPair } from 'views/Info/components/CurrencyLogo/CurrencyPair'
import { Break, ClickableColumnHeader } from 'views/Info/components/InfoTables/shared'
import { POOL_HIDE, v3InfoPath } from '../../constants'
import { PoolData } from '../../types'
import { feeTierPercent } from '../../utils'
import { formatDollarAmount } from '../../utils/numbers'
import { GreyBadge } from '../Card'
import Loader, { LoadingRows } from '../Loader'
import { RowFixed } from '../Row'
import { SortButton, useSortFieldClassName } from '../SortButton'

// const ResponsiveGrid = styled.div`
//   display: grid;
//   grid-gap: 1em;
//   align-items: center;

//   grid-template-columns: 20px 3.5fr repeat(3, 1fr);
//   padding: 0 24px;
//   @media screen and (max-width: 900px) {
//     grid-template-columns: 20px 1.5fr repeat(2, 1fr);
//     & :nth-child(3) {
//       display: none;
//     }
//   }

//   @media screen and (max-width: 500px) {
//     grid-template-columns: 20px 1.5fr repeat(1, 1fr);
//     & :nth-child(5) {
//       display: none;
//     }
//   }

//   @media screen and (max-width: 480px) {
//     grid-template-columns: 1.3fr 1fr;
//     > *:nth-child(1) {
//       display: none;
//     }
//   }
// `

const CustomContainer = styled.div`
  min-width: 1100px;
  width: 100%;
  border: 1px solid grey;
  border-radius: 20px;
  /* margin: 0 auto; */
  overflow-x: none;
  & > div:nth-child(1) {
    background: #343142;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  & > div:last-child {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`
export const ResponsiveGrid = styled.div`
  display: grid;
  padding: 0px;
  border-bottom: 1px solid grey;
  grid-gap: 1.5em;
  align-items: center;
  /* background-color: #343142; */
  background-color: #252136;

  /* grid-template-columns: 2fr 0.8fr repeat(4, 1fr); */
  grid-template-columns: 20px 2fr repeat(3, 1fr);

  padding: 15px 30px;
`

const PlusButton = styled.div`
  height: 30px;
  width: 30px;
  background-color: #2dfe87;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FlexHidden = styled(Flex)`
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    display: none;
  }
`
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #252136;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
`
const FlexVisible = styled(Flex)`
  display: none;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    display: flex;
    color: #35ed84;
    margin-left: 10px;
  }
`

const LinkWrapper = styled(NextLink)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const SORT_FIELD = {
  feeTier: 'feeTier',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  volumeUSDWeek: 'volumeUSDWeek',
}

const DataRow = ({ poolData, index, chainPath }: { poolData: PoolData; index: number; chainPath: string }) => {
  const chainName = useChainNameByQuery()
  return (
    <LinkWrapper href={`/${v3InfoPath}${chainPath}/pairs/${poolData.address}`}>
      <ResponsiveGrid>
        <Text fontWeight={400}>{index + 1}</Text>
        <Text fontWeight={400}>
          <RowFixed>
            <CurrencyPair address0={poolData.token0.address} address1={poolData.token1.address} chainName={chainName} />
            {/* <CurrencyPair address0={poolData.token0.address} address1={poolData.token1.address}  /> */}
            {/* <CurrencyPair address0={poolData.token0.address} address1={poolData.token1.address} chainName={chainName} /> */}
            <Text ml="22px">
              {poolData.token0.symbol}/{poolData.token1.symbol}
            </Text>
            <GreyBadge ml="10px" style={{ fontSize: 14 }}>
              {feeTierPercent(poolData.feeTier)}
            </GreyBadge>
          </RowFixed>
        </Text>
        <Text fontWeight={400}>{formatDollarAmount(poolData.tvlUSD)}</Text>
        <Text fontWeight={400}>{formatDollarAmount(poolData.volumeUSD)}</Text>
        <Text fontWeight={400}>{formatDollarAmount(poolData.volumeUSDWeek)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

const MAX_ITEMS = 10

export default function PoolTable({ poolDatas, maxItems = MAX_ITEMS }: { poolDatas: PoolData[]; maxItems?: number }) {
  const { chainId } = useActiveChainId()

  const { t } = useTranslation()
  // theming
  const { theme } = useTheme()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.tvlUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const chainPath = useMultiChainPath()

  // pagination
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10
  // const displayfarms = poolDatas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(poolDatas.length / PAGE_SIZE)

  function nextPage() {
    setPage(Math.min(totalPages, page + 1))
  }
  function prevPage() {
    if (page > 1) {
      setPage(Math.max(0, page - 1))
    }
  }
  // useEffect(() => {
  //   let extraPages = 1
  //   if (poolDatas.length % maxItems === 0) {
  //     extraPages = 0
  //   }
  //   setMaxPage(Math.floor(poolDatas.length / maxItems) + extraPages)
  // }, [maxItems, poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
          .filter((x) => !!x && !POOL_HIDE?.[chainId]?.includes(x.address))
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [chainId, maxItems, page, poolDatas, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
      setPage(1)
    },
    [sortDirection, sortField],
  )

  const getSortFieldClassName = useSortFieldClassName(sortField, sortDirection)

  if (!poolDatas) {
    return <Loader />
  }

  const Pagination = () => {
    return (
      <PaginationContainer>
        <Box size={['xs', 'xs', 'lg', 'lg']}>
          <Flex alignItems="center" justifyContent="center" mt={10} mb={10} py="8px" px="24px">
            <Flex justifyContent="center">
              <Button
                variant="secondary"
                scale="sm"
                height="30px"
                width="30px"
                minWidth="30px"
                minHeight="30px"
                ml={2}
                onClick={prevPage}
                style={{
                  color: 'white',
                  border: 'none',
                  background: 'black',
                  marginLeft: '10px',
                }}
                disabled={page === 1}
              >
                <ChevronLeftIcon width="24px" color="#646972" />
              </Button>
              <FlexHidden>
                {Array.from(Array(totalPages).keys())
                  .map((i) => (
                    <PlusButton
                      onClick={() => setPage(i + 1)}
                      style={{
                        cursor: 'pointer',
                        marginLeft: '10px',
                        border: page === i + 1 ? '1px solid #2EFE87' : 'none',
                        color: page === i + 1 ? 'black' : 'white',
                        background: page === i + 1 ? '#2EFE87' : 'black',
                      }}
                    >
                      {i + 1}
                    </PlusButton>
                  ))
                  .reduce((acc, curr, i) => {
                    if (i === 0) {
                      return [curr]
                    }
                    if (i === page - 3 || i === page + 1) {
                      return [...acc, curr]
                    }
                    if (i > page - 3 && i < page + 2) {
                      return [...acc, curr]
                    }
                    return acc
                  }, [])}
              </FlexHidden>
              <FlexVisible>
                {page} of {totalPages}
              </FlexVisible>

              <Button
                variant="secondary"
                scale="sm"
                height="30px"
                width="30px"
                minWidth="30px"
                minHeight="30px"
                ml={2}
                onClick={nextPage}
                style={{
                  color: 'white',
                  border: 'none',
                  background: 'black',
                  marginLeft: '10px',
                }}
                disabled={page === totalPages}
              >
                <ChevronRightIcon width="20px" color="#646972" />
              </Button>
            </Flex>
          </Flex>
        </Box>
      </PaginationContainer>
    )
  }

  return (
    <CustomContainer>
      {sortedPools.length > 0 ? (
        <>
          <ResponsiveGrid>
            <Text color={theme.colors.textSubtle}>#</Text>
            <ClickableColumnHeader color={theme.colors.textSubtle}>
              {t('Pair')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.feeTier)}
                className={getSortFieldClassName(SORT_FIELD.feeTier)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color={theme.colors.textSubtle}>
              {t('TVL')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.tvlUSD)}
                className={getSortFieldClassName(SORT_FIELD.tvlUSD)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color={theme.colors.textSubtle}>
              {t('Volume 24H')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.volumeUSD)}
                className={getSortFieldClassName(SORT_FIELD.volumeUSD)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color={theme.colors.textSubtle}>
              {t('Volume 7D')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
                className={getSortFieldClassName(SORT_FIELD.volumeUSDWeek)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
          </ResponsiveGrid>
          <Break />
          {sortedPools.map((poolData, i) => {
            if (poolData) {
              return (
                <React.Fragment key={`${poolData?.address}_Row`}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} poolData={poolData} chainPath={chainPath} />
                  <Break />
                </React.Fragment>
              )
            }
            return null
          })}
          <Pagination />

          {/* <PageButtons>
            <Box
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <Arrow>
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
            </Box>
            <Text>{`Page ${page} of ${maxPage}`}</Text>
            <Box
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <Arrow>
                <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </Box>
          </PageButtons> */}
        </>
      ) : (
        <LoadingRows>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRows>
      )}
    </CustomContainer>
  )
}
