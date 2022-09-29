import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getTokensBalanceOfWallet } from "utils/getTokensBalance"
import { RootState } from "app/store"
import { WalletTokenState } from "features/walletBalance/walletBalanceSlice.d"

const initialState: WalletTokenState = {
  loading: false,
  tokens: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchPdaBalance: any = createAsyncThunk(
  "balance/fetchPdaBalance",
  async (publicKey: string, { getState }) => {
    console.log("pda.....", publicKey)
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens

    // fetch wallet tokens
    const tokensBalance = await getTokensBalanceOfWallet(
      publicKey,
      tokens.filter((token) => token.chainId === "solana")
    )
    return tokens.map((token) => ({
      symbol: token.symbol,
      balance: tokensBalance[token.symbol] || 0
    }))
  }
)

const pdaBalanceSlice = createSlice({
  name: "pdaBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPdaBalance.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchPdaBalance.fulfilled,
      (state, action: PayloadAction<typeof initialState.tokens>) => {
        state.loading = false
        state.tokens = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchPdaBalance.rejected, (state, action) => {
      state.loading = false
      state.tokens = []
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default pdaBalanceSlice.reducer
