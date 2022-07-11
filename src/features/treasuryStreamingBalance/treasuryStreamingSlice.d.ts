export interface StreamingToken {
  symbol: string
  balance: number
}

export interface StreamingTokenState {
  loading: boolean
  tokens: StreamingToken[]
  error: string
}
