interface ResetIconProps {
  visible: boolean
}

export default function ResetIcon({ visible }: ResetIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
      className={visible ? "size-6 text-gray-900" : "size-6 text-transparent"}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}
