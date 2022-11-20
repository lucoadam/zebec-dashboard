export interface StreamingToken {
  symbol: string
  balance: number
  chainId: string
}

export interface StreamingTokenState {
  loading: boolean
  tokens: StreamingToken[]
  error: string
}
