import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import farmsReducer from './farms'
import { updateVersion } from './global/actions'
import lotteryReducer from './lottery'
import poolsReducer from './pools'
import transactions from './transactions/reducer'
import user from './user/reducer'
import potteryReducer from './pottery'
import globalReducer from './global/reducer'


import { ChainId } from '@pancakeswap/sdk'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
  // eslint-disable-next-line import/no-unresolved
} from '@reduxjs/toolkit/dist/matchers'
import { createAsyncThunk } from '@reduxjs/toolkit'
import stringify from 'fast-json-stable-stringify'
import { getFarmConfig } from '@pancakeswap/farms/constants'

import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { fetchMasterChefFarmPoolLength } from './fetchMasterChefData'



const PERSISTED_KEYS: string[] = ['user', 'transactions']

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  blacklist: ['profile'],
  storage,
  version: 1,
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    global: globalReducer,
    farms: farmsReducer,
    pools: poolsReducer,
    lottery: lotteryReducer,
    pottery: potteryReducer,

    // Exchange
    user,
    transactions,
  }),
)

// eslint-disable-next-line import/no-mutable-exports
let store: ReturnType<typeof makeStore>

export function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
  }

  return _store
}

store = initializeStore()

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store

export const persistor = persistStore(store, undefined, () => {
  store.dispatch(updateVersion())
})

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}

//code added for v2/migration.tsx
export const fetchFarmUserDataAsync = createAsyncThunk<
  FarmUserDataResponse[],
  { account: string; pids: number[] },
  {
    state: AppState
  }
>(
  'farmsV1/fetchFarmUserDataAsync',
  async ({ account, pids }) => {
    const farmsConfig = await getFarmConfig(ChainId.BSC)
    const poolLength = await fetchMasterChefFarmPoolLength()
    const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.v1pid))
    const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.v1pid))
    const userFarmAllowances = await fetchFarmUserAllowances(account, farmsCanFetch)
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsCanFetch)
    const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsCanFetch)
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsCanFetch)

    return userFarmAllowances.map((farmAllowance, index) => {
      return {
        pid: farmsCanFetch[index].v1pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      }
    })
  },
  {
    condition: (arg, { getState }) => {
      const { farmsV1 } = getState()
      if (farmsV1.loadingKeys[stringify({ type: fetchFarmUserDataAsync.typePrefix, arg })]) {
        console.debug('farms user action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

type UnknownAsyncThunkFulfilledOrPendingAction =
  | UnknownAsyncThunkFulfilledAction
  | UnknownAsyncThunkPendingAction
  | UnknownAsyncThunkRejectedAction

const serializeLoadingKey = (
  action: UnknownAsyncThunkFulfilledOrPendingAction,
  suffix: UnknownAsyncThunkFulfilledOrPendingAction['meta']['requestStatus'],
) => {
  const type = action.type.split(`/${suffix}`)[0]
  return stringify({
    arg: action.meta.arg,
    type,
  })
}