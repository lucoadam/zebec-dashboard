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
export const fetchTreasuryVaultBalance: any = createAsyncThunk(
  "balance/fetchTreasuryVaultBalance",
  async ({ name, address, network }: FetchTreasuryProps, { getState }) => {
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens.filter(
      (token) => token.network === network && token.chainId === "solana"
    )

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

const treasuryVaultBalanceSlice = createSlice({
  name: "treasuryVaultBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTreasuryVaultBalance.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTreasuryVaultBalance.fulfilled,
      (state, action: PayloadAction<typeof initialState.treasury>) => {
        state.loading = false
        state.treasury = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchTreasuryVaultBalance.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default treasuryVaultBalanceSlice.reducer
