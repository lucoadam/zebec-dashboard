import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"

interface AmountFieldProps {
  tokenSymbol: string
  tokens: TokenDetails[]
  register: UseFormRegister<{
    [key: string]: string | number | undefined | null
  }>
  setValue: UseFormSetValue<{
    [key: string]: string | number | undefined | null
  }>
  name: string
  error?: string
  disabled?: boolean
}
