import { createApiHook } from 'views/Dashboard/lib/api/hook'

export const useEarningPointHistory = createApiHook<any>({
  type: 'query',
  endpoint: '/points/history',
  queryKey: ['points-history'],
  transformResponse: (data) => ({
    ...data,
  }),
})
