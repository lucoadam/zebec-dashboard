import { WalletToken } from "features/walletBalance/walletBalanceSlice.d"

export interface InstantStreamFormData {
  transactionName: string
  receiverWallet: string
  remarks?: string
  showRemarks?: boolean
  amount: string
  token: string
  file?: string
}

export type InstantFormKeys =
  | "transactionName"
  | "showREMarks"
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
