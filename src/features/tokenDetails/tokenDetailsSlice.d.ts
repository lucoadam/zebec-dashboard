export interface TokenDetails {
  name: string
  symbol: string
  image: string
  decimal: number
  mint: string
  coingeckoId: string
}

export interface TokenResponse {
  name: string
  symbol: string
  mint: string
  decimal: number
  coingeco_id: string
}

export interface TokenDetailsState {
  loading: boolean
  fetchingPrice: boolean
  tokens: TokenDetails[]
  prices: { [key: string]: number }
  error: string
}
