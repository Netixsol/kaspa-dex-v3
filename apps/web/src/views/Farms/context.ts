import { createContext } from 'react'
import type { V3Farm } from './FarmsV3'

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export const FarmsV3Context = createContext<{ chosenFarmsMemoized: V3Farm[] }>({
  chosenFarmsMemoized: [],
})
