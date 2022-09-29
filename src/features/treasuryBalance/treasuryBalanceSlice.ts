import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "app/store"
import { getTokensBalanceOfWallet } from "utils/getTokensBalance"
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTreasuryBalance: any = createAsyncThunk(
  "balance/fetchTreasuryBalance",
  async ({ name, address }: FetchTreasuryProps, { getState }) => {
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens

    // fetch treasury tokens
    const tokensBalance = await getTokensBalanceOfWallet(address, tokens)

    const mappedTokens = tokens.map((token) => ({
      symbol: token.symbol,
      balance: tokensBalance[token.symbol] || 0
    }))

    return {
      name,
      address,
      tokens: mappedTokens
    }
  }
)

const treasuryBalanceSlice = createSlice({
  name: "treasuryBalance",
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

export default treasuryBalanceSlice.reducer
