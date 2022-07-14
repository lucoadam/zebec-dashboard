export interface TimePickerProps {
  error?: boolean
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any
  name: string
  onChange: (value: string) => void
  startIcon?: JSX.Element
  endIcon?: JSX.Element
  disabled?: boolean
  reset?: () => void
}
