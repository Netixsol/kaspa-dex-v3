// lib/api/hooks.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  MutationFunction,
} from '@tanstack/react-query'
import { apiClient } from './client'

type ApiConfigBase<T> = {
  endpoint: string
  transformResponse?: (data: any) => T
}

type QueryConfig<T> = ApiConfigBase<T> & {
  type: 'query'
  queryKey: QueryKey
  params?: Record<string, any>
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
}

type MutationConfig<T, V> = ApiConfigBase<T> & {
  type: 'mutation'
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  mutationKey?: QueryKey
  options?: Omit<UseMutationOptions<T, Error, V>, 'mutationKey' | 'mutationFn'>
  headers?: Record<string, string> // Add headers specifically for mutations
}

export function createApiHook<T = any>(
  config: QueryConfig<T>,
): (
  params?: Record<string, any>,
  hookOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) => ReturnType<typeof useQuery<T>>

export function createApiHook<T = any, V = any>(
  config: MutationConfig<T, V>,
): ReturnType<typeof useMutation<T, Error, V>>

export function createApiHook<T, V = any>(config: QueryConfig<T> | MutationConfig<T, V>) {
  if (config.type === 'query') {
    return (params?: Record<string, any>, hookOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>) => {
      const mergedConfig = {
        ...config,
        params,
        options: { ...config.options, ...hookOptions },
      }

      return useQuery<T>({
        queryKey: Array.isArray(mergedConfig.queryKey)
          ? [...mergedConfig.queryKey, params]
          : [mergedConfig.queryKey, params],
        queryFn: async () => {
          const res = await apiClient.get<{ data?: T }>(mergedConfig.endpoint, { params })
          return mergedConfig.transformResponse ? mergedConfig.transformResponse(res) : res?.data ?? ({} as T)
        },
        ...mergedConfig.options,
      })
    }
  } else {
    const mutationFn: MutationFunction<T, V> = async (variables) => {
      const requestConfig = {
        body: variables,
        headers: config.headers, // Use headers from config
      }

      switch (config.method || 'POST') {
        case 'POST':
          return apiClient.post<T>(config.endpoint, requestConfig)
        case 'PUT':
          return apiClient.put<T>(config.endpoint, requestConfig)
        case 'PATCH':
          return apiClient.patch<T>(config.endpoint, requestConfig)
        case 'DELETE':
          return apiClient.delete<T>(config.endpoint, requestConfig)
        default:
          throw new Error(`Unsupported method: ${config.method}`)
      }
    }

    return useMutation<T, Error, V>({
      mutationKey: config.mutationKey ? [config.mutationKey] : undefined,
      mutationFn,
      ...config.options,
    })
  }
}
