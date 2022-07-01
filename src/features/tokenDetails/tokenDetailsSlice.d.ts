export interface TokenDetails {
  name: string;
  symbol: number;
  image: string;
  decimal: number;
  mint: string;
  coingeckoId: string;
}

export interface TokenDetailsState {
  loading: boolean;
  tokens: TokenDetails[];
  error: string;
}
