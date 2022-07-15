export interface WalletToken {
  symbol: string
  balance: number
}

export interface WalletTokenState {
  loading: boolean
  tokens: WalletToken[]
  error: string
}
