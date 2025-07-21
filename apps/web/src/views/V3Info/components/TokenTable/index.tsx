import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  Flex,
  NextLinkFromReactRouter,
  SortArrowIcon,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import React, { useCallback, useMemo, useState } from 'react'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import styled from 'styled-components'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { Break, ClickableColumnHeader } from 'views/Info/components/InfoTables/shared'
import { TOKEN_HIDE, v3InfoPath } from '../../constants'
import { TokenData } from '../../types'
import { formatDollarAmount } from '../../utils/numbers'
import HoverInlineText from '../HoverInlineText'
import Loader, { LoadingRows } from '../Loader'
import Percent from '../Percent'
import { RowFixed } from '../Row'
import { SortButton, useSortFieldClassName } from '../SortButton'

// const ResponsiveGrid = styled.div`
//   display: grid;
//   grid-gap: 1em;
//   align-items: center;

//   grid-template-columns: 20px 3fr repeat(4, 1fr);
//   padding: 0 24px;
//   @media screen and (max-width: 900px) {
//     grid-template-columns: 20px 1.5fr repeat(3, 1fr);
//     & :nth-child(4) {
//       display: none;
//     }
//   }

//   @media screen and (max-width: 800px) {
//     grid-template-columns: 20px 1.5fr repeat(2, 1fr);
//     & :nth-child(6) {
//       display: none;
//     }
//   }

//   @media screen and (max-width: 670px) {
//     grid-template-columns: 1.3fr 1fr;
//     > *:first-child {
//       display: none;
//     }
//     > *:nth-child(3) {
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
  grid-template-columns: 20px 2.5fr repeat(4, 1fr);

  padding: 15px 30px;
`

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
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

const ResponsiveLogo = styled(CurrencyLogo)`
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
  }
`

const DataRow = ({ tokenData, index, chainPath }: { tokenData: TokenData; index: number; chainPath: string }) => {
  const { theme } = useTheme()
  const chainName = useChainNameByQuery()
  const { isMobile } = useMatchBreakpoints()
  return (
    <LinkWrapper to={`/${v3InfoPath}${chainPath}/tokens/${tokenData.address}`}>
      <ResponsiveGrid>
        <Text>{index + 1}</Text>
        <Flex>
          <RowFixed>
            <ResponsiveLogo address={tokenData.address} chainName={chainName} />
          </RowFixed>

          <Text style={{ marginLeft: '10px' }}>
            <RowFixed>
              {isMobile ? <HoverInlineText text={tokenData.symbol} /> : <HoverInlineText text={tokenData.name} />}
              {!isMobile && (
                <Text ml="8px" color="rgba(255, 255, 255, 0.50)">
                  ({tokenData.symbol})
                </Text>
              )}
            </RowFixed>
          </Text>
        </Flex>
        <Text fontWeight={400}>{formatDollarAmount(tokenData.priceUSD)}</Text>
        <Text fontWeight={400}>
          <Percent value={tokenData.priceUSDChange} fontWeight={400} />
        </Text>
        <Text fontWeight={400}>{formatDollarAmount(tokenData.volumeUSD)}</Text>
        <Text fontWeight={400}>{formatDollarAmount(tokenData.tvlUSD)}</Text>
      </ResponsiveGrid>{' '}
    </LinkWrapper>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek',
}

const MAX_ITEMS = 10

export default function TokenTable({
  tokenDatas,
  maxItems = MAX_ITEMS,
}: {
  tokenDatas: TokenData[] | undefined
  maxItems?: number
}) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const chainPath = useMultiChainPath()

  // theming
  const { theme } = useTheme()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.tvlUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  // pagination
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10
  const displayTokens = tokenDatas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(tokenDatas.length / PAGE_SIZE)

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
  //   if (tokenDatas) {
  //     if (tokenDatas.length % maxItems === 0) {
  //       extraPages = 0
  //     }
  //     setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
  //   }
  // }, [maxItems, tokenDatas])

  const sortedTokens = useMemo(() => {
    return tokenDatas
      ? tokenDatas
          .filter((x) => !!x && !TOKEN_HIDE?.[chainId]?.includes(x.address))
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof TokenData] > b[sortField as keyof TokenData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [tokenDatas, maxItems, page, , sortField, sortDirection, chainId])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
      setPage(1)
    },
    [sortDirection, sortField],
  )
  const getSortFieldClassName = useSortFieldClassName(sortField, sortDirection)

  if (!tokenDatas) {
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
                <ChevronLeftIcon width="24px" color="white" />
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
      {sortedTokens.length > 0 ? (
        <AutoColumn gap="0px">
          <ResponsiveGrid style={{ background: ' #343142', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
            <Text color={theme.colors.textSubtle}>#</Text>
            <ClickableColumnHeader color={theme.colors.textSubtle}>
              {t('Name')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.name)}
                className={getSortFieldClassName(SORT_FIELD.name)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color={theme.colors.textSubtle}>
              {t('Price')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.priceUSD)}
                className={getSortFieldClassName(SORT_FIELD.priceUSD)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            <ClickableColumnHeader color={theme.colors.textSubtle}>
              {t('Price Change')}
              <SortButton
                scale="sm"
                variant="subtle"
                onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
                className={getSortFieldClassName(SORT_FIELD.priceUSDChange)}
              >
                <SortArrowIcon />
              </SortButton>
            </ClickableColumnHeader>
            {/* <ClickableText onClick={() => handleSort(SORT_FIELD.priceUSDChangeWeek)}>
            7d {arrow(SORT_FIELD.priceUSDChangeWeek)}
          </ClickableText> */}
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
          </ResponsiveGrid>

          <Break />
          {sortedTokens.map((data, i) => {
            if (data) {
              return (
                <React.Fragment key={`${data.address}_sortedTokens`}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} tokenData={data} chainPath={chainPath} />
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
        </AutoColumn>
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
