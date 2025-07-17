const ChevronIcon = ({ color, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.2041 7.70806L6.21966 2.15264L1.15962 7.73291" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default ChevronIcon
