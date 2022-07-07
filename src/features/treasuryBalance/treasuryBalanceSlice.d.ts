export interface TreasuryToken {
  symbol: string;
  balance: number;
  usdBalance: number | null;
}

export interface TreasuryState {
  loading: boolean;
  treasury?: {
    name: string;
    address: string;
    tokens: TreasuryToken[];
  };
  error: string;
}

export interface FetchTreasuryProps {
  address: string;
  name: string;
}
