import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { WalletToken } from "features/walletBalance/walletBalanceSlice.d"

export const getBalance = (
  walletTokens: WalletToken[] | TreasuryToken[],
  symbol: string
) => walletTokens.find((t) => t.symbol === symbol)?.balance || 0

export const getUsdBalance = (
  walletTokens: WalletToken[] | TreasuryToken[],
  symbol: string
) => walletTokens.find((t) => t.symbol === symbol)?.usdBalance || 0
