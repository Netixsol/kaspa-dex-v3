import { useState } from 'react'

const useSpin = () => {
  const [initState, setInitState] = useState<boolean>(true)
  const [randIndex, setRandIndex] = useState<number>(0)
  const [isFinished, setIsFinished] = useState(true)
  const [fetchSpinHistory, setFetchSpinHistory] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string>()
  const items = ['500', '800', '1000', '1500', '2000', '2500']
  const spinTime = 8000

const spinNow = (): string => {
  const randItemIndex = Math.floor(Math.random() * items.length)
  const selected = items[randItemIndex]

  setIsFinished(false)
  setTimeout(() => {
    setIsFinished(true)
    setSelectedItem(selected)
    setFetchSpinHistory(true)
  }, spinTime)

  setInitState(false)
  setRandIndex(randItemIndex)

  return selected
}

  return { setSelectedItem, selectedItem, spinNow, initState, randIndex, isFinished, items, spinTime, fetchSpinHistory, setFetchSpinHistory }
}

export default useSpin
