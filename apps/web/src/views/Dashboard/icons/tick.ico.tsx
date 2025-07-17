// ;<svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
//   <path d="M0.777344 4.5183L5.10585 8.66645L13.2218 0.888672" stroke="#120F1F" stroke-linecap="round" />
// </svg>

import { SvgProps } from '@pancakeswap/uikit'

const TickIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <svg {...props} viewBox="0 0 14 10">
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M0.777344 4.5183L5.10585 8.66645L13.2218 0.888672"
        stroke="#120F1F"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default TickIcon
