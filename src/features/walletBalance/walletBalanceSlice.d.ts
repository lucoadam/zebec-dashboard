export interface WalletToken {
  symbol: string
  balance: number
  chainId: string
}

export interface WalletTokenState {
  loading: boolean
  tokens: WalletToken[]
  error: string
}
