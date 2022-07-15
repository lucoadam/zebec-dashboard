export interface ZebecToken {
  symbol: string
  balance: number
}

export interface ZebecTokenState {
  loading: boolean
  tokens: ZebecToken[]
  error: string
}
