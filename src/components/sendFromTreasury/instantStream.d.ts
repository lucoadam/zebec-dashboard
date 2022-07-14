import { WalletToken } from "features/walletBalance/walletBalanceSlice.d"

export interface InstantStreamFormData {
  transactionName: string
  receiverWallet: string
  remarks?: string
  amount: string
  token: string
  file?: string
}

export type InstantFormKeys =
  | "transactionName"
  | "receiverWallet"
  | "remarks"
  | "amount"
  | "token"
  | "file"

export interface InstantStreamProps {
  setFormValues?: (values: InstantStreamFormData) => void
  tokenBalances: WalletToken[]
  addFile?: boolean
  className?: string
}
