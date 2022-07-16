import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TokenListProvider } from "@solana/spl-token-registry"
import { RootState } from "app/store"
import { getRPCNetwork } from "constants/cluster"
import tokenMetaData from "fakedata/tokens.json"
import { getTokensUSDPrice } from "utils/getTokensPrice"
import { TokenDetailsState } from "./tokenDetailsSlice.d"

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
  async (_, { getState }) => {
    const { tokenDetails } = getState() as RootState
    let tokens = tokenDetails.tokens
    const tokensMint = tokenMetaData
      .filter((token) => token.mint)
      .map((token) => token.mint)
    const tokensData = await (await new TokenListProvider().resolve())
      .filterByClusterSlug(getRPCNetwork())
      .getList()

    tokens = [
      {
        name: "Solana",
        symbol: "SOL",
        image:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        mint: "solana",
        decimal: 18,
        coingeckoId: "solana"
      },
      ...tokensData
        .filter((token) => tokensMint.includes(token.address))
        .map((token) => ({
          name: token.name,
          symbol: token.symbol,
          image: token.logoURI || "",
          decimal: token.decimals,
          mint: token.address,
          coingeckoId: token?.extensions?.coingeckoId || ""
        }))
    ]
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
