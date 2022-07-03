export interface WalletToken {
  symbol: string;
  balance: number;
  usdBalance: number | null;
}

export interface WalletTokenState {
  loading: boolean;
  tokens: WalletToken[];
  error: string;
}
