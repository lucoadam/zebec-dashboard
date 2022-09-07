import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "app/store"
import { getTokensUSDPrice } from "utils/getTokensPrice"
import { TokenDetailsState, TokenResponse } from "./tokenDetailsSlice.d"

const initialState: TokenDetailsState = {
  loading: false,
  fetchingPrice: false,
  tokens: [],
  prices: {},
  error: ""
}

//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokens: any = createAsyncThunk(
  "token/fetchTokens",
  async (tokenDetails: TokenResponse[]) => {
    const tokens = tokenDetails.map((res) => ({
      name: res.name,
      symbol: res.symbol,
      decimal: res.decimal,
      mint: res.mint,
      coingeckoId: res.coingeco_id,
      chainId: res.chainId
    }))

    return tokens
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokensPrice: any = createAsyncThunk(
  "token/fetchTokensPrice",
  async (_, { getState }) => {
    const { tokenDetails } = getState() as RootState
    const tokensPrice = await getTokensUSDPrice(tokenDetails.tokens)
    return tokensPrice
  }
)

const tokenSlice = createSlice({
  name: "tokenDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTokens.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTokens.fulfilled,
      (state, action: PayloadAction<typeof initialState.tokens>) => {
        state.loading = false
        state.tokens = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchTokens.rejected, (state, action) => {
      state.loading = false
      state.tokens = []
      state.error = action.error.message ?? "Something went wrong"
    })
    builder.addCase(fetchTokensPrice.pending, (state) => {
      state.fetchingPrice = true
    })
    builder.addCase(
      fetchTokensPrice.fulfilled,
      (state, action: PayloadAction<typeof initialState.prices>) => {
        state.fetchingPrice = false
        state.prices = action.payload
      }
    )
    builder.addCase(fetchTokensPrice.rejected, (state, action) => {
      state.fetchingPrice = false
      state.prices = {}
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default tokenSlice.reducer
