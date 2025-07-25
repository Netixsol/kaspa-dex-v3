import dynamic from 'next/dynamic';
import { FlexGap, useModal } from '@pancakeswap/uikit'
// import HoverLottie from './HoverLottie'
import SettingsModal from './SettingsModal'
import settings from './settings-slider.json'

const HoverLottie = dynamic(() => import('./HoverLottie'), { ssr: false });
type Props = {
  color?: string
  mr?: string
  mode?: string
}

const GlobalSettings = ({ mode }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)
  // const [onCopyModel] = useModal(<ShareModel mode={mode} />)

  return (
    <FlexGap alignItems="center" columnGap="15px">
      <HoverLottie
        onClick={onPresentSettingsModal}
        animationData={settings}
        style={{
          height: '32px',
          color: '#fff',
          marginRight: '10px',
          cursor: 'pointer',
          transform: 'rotate(90deg)',
        }}
      />
      {/* <IconButton/> */}
    </FlexGap>
  )
}

export default GlobalSettings
