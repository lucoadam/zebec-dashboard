import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getTokensBalanceOfWallet } from "utils/getTokensBalance"
import { RootState } from "app/store"
import { WalletTokenState } from "./walletBalanceSlice.d"
import { getEVMTokenBalance } from "utils/getEVMTokenBalance"
import { Signer } from "ethers"

const initialState: WalletTokenState = {
  loading: false,
  tokens: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWalletBalance: any = createAsyncThunk(
  "balance/fetchWalletBalance",
  async (
    {
      publicKey,
      chainId,
      network,
      signer
    }: {
      publicKey: string
      chainId: string
      network: string
      signer?: Signer
    },
    { getState }
  ) => {
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens.filter(
      (token) => token.chainId === chainId && token.network === network
    )
    // commented console.log("fetchWalletBalance", publicKey, chainId, signer)
    // fetch wallet tokens
    if (network === "solana") {
      const tokensBalance = await getTokensBalanceOfWallet(
        publicKey,
        tokens.filter(
          (token) => token.chainId === "solana" && token.network === network
        )
      )
      return tokens.map((token) => ({
        symbol: token.symbol,
        balance: tokensBalance[token.symbol] || 0
      }))
    } else if (signer) {
      const tokensBalance = await getEVMTokenBalance(
        publicKey,
        tokens.filter(
          (token) => token.chainId === chainId && token.network === network
        ),
        signer
      )
      return tokens
        .filter(
          (token) => token.chainId === chainId && token.network === network
        )
        .map((token) => ({
          symbol: token.symbol,
          balance: tokensBalance[token.mint] || 0,
          chainId: token.chainId,
          network: token.network
        }))
    }
  }
)

const walletBalanceSlice = createSlice({
  name: "walletBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWalletBalance.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchWalletBalance.fulfilled,
      (state, action: PayloadAction<typeof initialState.tokens>) => {
        state.loading = false
        state.tokens = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchWalletBalance.rejected, (state, action) => {
      state.loading = false
      state.tokens = []
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default walletBalanceSlice.reducer
