export interface ZebecToken {
  symbol: string
  balance: number
  chainId: string
}

export interface ZebecTokenState {
  loading: boolean
  tokens: ZebecToken[]
  error: string
}
