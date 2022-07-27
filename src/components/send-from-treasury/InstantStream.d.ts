import { WalletToken } from "features/walletBalance/walletBalanceSlice.d"

export interface InstantStreamFormData {
  wallet: string
  transaction_name: string
  sender: string
  receiver: string
  remarks?: string
  showRemarks?: boolean
  amount: string
  symbol: string
  file?: string
}

export type InstantFormKeys = keyof InstantStreamFormData

export interface InstantStreamProps {
  setFormValues?: (values: InstantStreamFormData) => void
  tokenBalances: WalletToken[]
  addFile?: boolean
  className?: string
}
