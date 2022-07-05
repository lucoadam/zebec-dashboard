import { WalletToken } from "features/walletBalance/walletBalanceSlice.d";

export const getBalance = (walletTokens: WalletToken[], symbol: string) =>
  walletTokens.find((t) => t.symbol === symbol)?.balance || 0;

export const getUsdBalance = (walletTokens: WalletToken[], symbol: string) =>
  walletTokens.find((t) => t.symbol === symbol)?.usdBalance || 0;
