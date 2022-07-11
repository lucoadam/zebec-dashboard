import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "app/store"
import { getTokensBalanceOfWallet } from "utils/getTokensBalance"
import { getTokensUSDPrice } from "utils/getTokensPrice"
import { FetchTreasuryProps, TreasuryState } from "./treasuryBalanceSlice.d"

const initialState: TreasuryState = {
  loading: false,
  treasury: {
    name: "",
    address: "",
    tokens: []
  },
  error: ""
}

//Generates pending, fulfilled and rejected action types
export const fetchTreasuryBalance: any = createAsyncThunk(
  "balance/fetchTreasuryBalance",
  async ({ name, address }: FetchTreasuryProps, { getState }) => {
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens

    // fetch wallet tokens
    const tokensBalance = await getTokensBalanceOfWallet(address, tokens)

    // fetch USD price of tokens
    const tokensPrice = await getTokensUSDPrice(tokens)

    const mappedTokens = tokens.map((token) => ({
      symbol: token.symbol,
      balance: tokensBalance[token.mint] || 0,
      usdBalance: tokensPrice[token.mint]
        ? (tokensBalance[token.mint] || 0) * tokensPrice[token.mint]
        : null
    }))
    return {
      name,
      address,
      tokens: mappedTokens
    }
  }
)

const zebecBalanceSlice = createSlice({
  name: "zebecBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTreasuryBalance.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTreasuryBalance.fulfilled,
      (state, action: PayloadAction<typeof initialState.treasury>) => {
        state.loading = false
        state.treasury = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchTreasuryBalance.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default zebecBalanceSlice.reducer
