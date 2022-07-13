import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { PublicKey } from "@solana/web3.js"
import { getTokensBalanceOfWallet } from "utils/getTokensBalance"
import { getTokensUSDPrice } from "utils/getTokensPrice"
import { RootState } from "../../app/store"
import { ZebecTokenState } from "./zebecBalanceSlice.d"

const initialState: ZebecTokenState = {
  loading: false,
  tokens: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchZebecBalance: any = createAsyncThunk(
  "balance/fetchZebecBalance",
  async (wallet: string, { getState }) => {
    const base58PublicKey = new PublicKey(
      "AknC341xog56SrnoK6j3mUvaD1Y7tYayx1sxUGpeYWdX"
    )
    const validProgramAddressPub = await PublicKey.findProgramAddress(
      [new PublicKey(wallet).toBuffer()],
      base58PublicKey
    )
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens

    // fetch wallet tokens
    const tokensBalance = await getTokensBalanceOfWallet(
      validProgramAddressPub[0].toString(),
      tokens
    )

    // fetch USD price of tokens
    const tokensPrice = await getTokensUSDPrice(tokens)
    return tokens.map((token) => ({
      symbol: token.symbol,
      balance: tokensBalance[token.mint] || 0,
      usdBalance: tokensPrice[token.mint]
        ? (tokensBalance[token.mint] || 0) * tokensPrice[token.mint]
        : null
    }))
  }
)

const zebecBalanceSlice = createSlice({
  name: "zebecBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchZebecBalance.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchZebecBalance.fulfilled,
      (state, action: PayloadAction<typeof initialState.tokens>) => {
        state.loading = false
        state.tokens = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchZebecBalance.rejected, (state, action) => {
      state.loading = false
      state.tokens = []
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default zebecBalanceSlice.reducer
