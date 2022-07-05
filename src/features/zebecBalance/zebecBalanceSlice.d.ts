export interface ZebecToken {
  symbol: string;
  balance: number;
  usdBalance: number | null;
}

export interface ZebecTokenState {
  loading: boolean;
  tokens: ZebecToken[];
  error: string;
}
