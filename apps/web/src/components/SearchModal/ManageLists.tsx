import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  CheckmarkIcon,
  CogIcon,
  Input,
  LinkExternal,
  ListLogo,
  Text,
  Toggle,
  useTooltip,
  AutoColumn,
  Column,
} from '@pancakeswap/uikit'
import { TokenList, Version } from '@pancakeswap/token-lists'
import Card from 'components/Card'
import { BSC_URLS, ETH_URLS, UNSUPPORTED_LIST_URLS } from 'config/constants/lists'
import { useAtomValue } from 'jotai'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useListState } from 'state/lists/lists'
import styled from 'styled-components'
import {
  useFetchListCallback,
  acceptListUpdate,
  disableList,
  enableList,
  removeList,
} from '@pancakeswap/token-lists/react'
import uriToHttp from '@pancakeswap/utils/uriToHttp'
import { ChainId } from '@pancakeswap/sdk'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { selectorByUrlsAtom, useActiveListUrls, useAllLists, useIsListActive } from '../../state/lists/hooks'

import Row, { RowBetween, RowFixed } from '../Layout/Row'
import { CurrencyModalView } from './types'

function listVersionLabel(version: Version): string {
  return `v${version.major}.${version.minor}.${version.patch}`
}

const Wrapper = styled(Column)`
  width: 100%;
  height: 100%;
`

const RowWrapper = styled(Row)<{ active: boolean; hasActiveTokens: boolean }>`
  background-color: ${({ active, theme }) => (active ? `${theme.colors.success19}` : 'transparent')};
  border: solid 1px;
  border-color: ${({ active, theme }) => (active ? theme.colors.success : theme.colors.tertiary)};
  transition: 200ms;
  align-items: center;
  padding: 1rem;
  border-radius: 20px;
  opacity: ${({ hasActiveTokens }) => (hasActiveTokens ? 1 : 0.4)};
`

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const isActive = useIsListActive(listUrl)

  const listsByUrl = useAtomValue(selectorByUrlsAtom)
  const [, dispatch] = useListState()
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

  const activeTokensOnThisChain = useMemo(() => {
    if (!list || !chainId) {
      return 0
    }
    return list.tokens.reduce((acc, cur) => (cur.chainId === chainId ? acc + 1 : acc), 0)
  }, [chainId, list])

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return
    dispatch(acceptListUpdate(listUrl))
  }, [dispatch, listUrl, pending])

  const handleRemoveList = useCallback(() => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Please confirm you would like to remove this list')) {
      dispatch(removeList(listUrl))
    }
  }, [dispatch, listUrl])

  const handleEnableList = useCallback(() => {
    dispatch(enableList(listUrl))
  }, [dispatch, listUrl])

  const handleDisableList = useCallback(() => {
    dispatch(disableList(listUrl))
  }, [dispatch, listUrl])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <div>
      <Text>{list && listVersionLabel(list.version)}</Text>
      <LinkExternal external href={`https://tokenlists.org/token-list?url=${listUrl}`}>
        {t('See')}
      </LinkExternal>
      <Button variant="danger" scale="xs" onClick={handleRemoveList} disabled={Object.keys(listsByUrl).length === 1}>
        {t('Remove')}
      </Button>
      {pending && (
        <Button variant="text" onClick={handleAcceptListUpdate} style={{ fontSize: '12px' }}>
          {t('Update list')}
        </Button>
      )}
    </div>,
    { placement: 'right-end', trigger: 'click', isInPortal: false },
  )

  if (!list) return null

  return (
    <RowWrapper
      active={isActive}
      hasActiveTokens={activeTokensOnThisChain > 0}
      key={listUrl}
      id={listUrlRowHTMLId(listUrl)}
    >
      {tooltipVisible && tooltip}
      {list.logoURI ? (
        <ListLogo size="40px" style={{ marginRight: '1rem' }} logoURI={list.logoURI} alt={`${list.name} list logo`} />
      ) : (
        <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          <Text bold>{list.name}</Text>
        </Row>
        <RowFixed mt="4px">
          <Text fontSize="12px" mr="6px" textTransform="lowercase">
            {list.tokens.length} {t('Tokens')}
          </Text>
          <span ref={targetRef}>
            <CogIcon color="text" width="12px" />
          </span>
        </RowFixed>
      </Column>
      <Toggle
        checked={isActive}
        onChange={() => {
          if (isActive) {
            handleDisableList()
          } else {
            handleEnableList()
          }
        }}
      />
    </RowWrapper>
  )
})

const ListContainer = styled.div`
  padding: 1rem 0;
  height: 100%;
  overflow: auto;
`

function ManageLists({
  setModalView,
  setImportList,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const [listUrlInput, setListUrlInput] = useState<string>('')

  const { chainId } = useActiveChainId()

  const { t } = useTranslation()
  const [, dispatch] = useListState()

  const lists = useAllLists()

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls()
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>()
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls)
    }
  }, [activeCopy, activeListUrls])

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value)
  }, [])

  const fetchList = useFetchListCallback(dispatch)

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0
  }, [listUrlInput])

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        const isValid = Boolean(lists[listUrl].current) && !UNSUPPORTED_LIST_URLS.includes(listUrl)

        if (isValid) {
          return (
            (chainId === ChainId.ETHEREUM && ETH_URLS.includes(listUrl)) ||
            (chainId === ChainId.BSC && BSC_URLS.includes(listUrl))
          )
        }

        return false
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1]
        const { current: l2 } = lists[u2]

        // first filter on active lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1
        }

        if (l1 && l2) {
          // Always make Kaspa Finance list in top.
          const keyword = 'pancakeswap'
          if (!l1.name.toLowerCase().includes(keyword) && l2.name.toLowerCase().includes(keyword)) {
            return 1
          }

          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1
        }
        if (l1) return -1
        if (l2) return 1
        return 0
      })
  }, [lists, chainId, activeCopy])

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>()
  const [addError, setAddError] = useState<string | undefined>()

  useEffect(() => {
    // if valid url, fetch details for card
    if (validUrl) {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError('Error importing list'))
    } else {
      setTempList(undefined)
      if (listUrlInput !== '') {
        setAddError('Enter valid list location')
      }
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined)
    }
  }, [fetchList, listUrlInput, validUrl])

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput)

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return
    setImportList(tempList)
    setModalView(CurrencyModalView.importList)
    setListUrl(listUrlInput)
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList])

  return (
    <Wrapper>
      <AutoColumn gap="14px">
        <Row>
          <Input
            id="list-add-input"
            scale="lg"
            placeholder={t('https:// or ipfs://')}
            value={listUrlInput}
            onChange={handleInput}
          />
        </Row>
        {addError ? (
          <Text color="failure" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {addError}
          </Text>
        ) : null}
      </AutoColumn>
      {tempList && (
        <AutoColumn style={{ marginTop: 8 }}>
          <Card padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {tempList.logoURI && <ListLogo logoURI={tempList.logoURI} size="40px" />}
                <AutoColumn gap="4px" style={{ marginLeft: '20px' }}>
                  <Text bold>{tempList.name}</Text>
                  <Text color="textSubtle" small textTransform="lowercase">
                    {tempList.tokens.length} {t('Tokens')}
                  </Text>
                </AutoColumn>
              </RowFixed>
              {isImported ? (
                <RowFixed>
                  <CheckmarkIcon width="16px" mr="10px" />
                  <Text>{t('Loaded')}</Text>
                </RowFixed>
              ) : (
                <Button width="fit-content" onClick={handleImport}>
                  {t('Import')}
                </Button>
              )}
            </RowBetween>
          </Card>
        </AutoColumn>
      )}
      <ListContainer>
        <AutoColumn gap="md">
          {sortedLists.map((listUrl) => (
            <ListRow key={listUrl} listUrl={listUrl} />
          ))}
        </AutoColumn>
      </ListContainer>
    </Wrapper>
  )
}

export default ManageLists
