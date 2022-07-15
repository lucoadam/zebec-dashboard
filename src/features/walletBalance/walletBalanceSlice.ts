import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getTokensBalanceOfWallet } from "utils/getTokensBalance"
import { RootState } from "../../app/store"
import { WalletTokenState } from "./walletBalanceSlice.d"

const initialState: WalletTokenState = {
  loading: false,
  tokens: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWalletBalance: any = createAsyncThunk(
  "balance/fetchWalletBalance",
  async (wallet: string, { getState }) => {
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens

    // fetch wallet tokens
    const tokensBalance = await getTokensBalanceOfWallet(wallet, tokens)

    return tokens.map((token) => ({
      symbol: token.symbol,
      balance: tokensBalance[token.mint] || 0
    }))
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
