export interface TreasuryToken {
  symbol: string
  balance: number
  chainId: string
}

export interface TreasuryState {
  loading: boolean
  treasury?: {
    name: string
    address: string
    tokens: TreasuryToken[]
  }
  error: string
}

export interface FetchTreasuryProps {
  address: string
  name: string
  network: string
}
