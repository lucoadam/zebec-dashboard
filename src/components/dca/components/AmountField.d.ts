import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { WalletToken } from "features/walletBalance/walletBalanceSlice.d"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"

interface Token {
  symbol: string
  image: string
}

interface AmountFieldProps {
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
  walletBalance?: WalletToken[]
  currentToken: Token
  setCurrentToken: (arg0: Token) => void
}
