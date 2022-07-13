import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TokenListProvider } from "@solana/spl-token-registry"
import { getRPCNetwork } from "constants/cluster"
import tokenMetaData from "fakedata/tokens.json"
import { getTokensUSDPrice } from "utils/getTokensPrice"
import { TokenDetailsState } from "./tokenDetailsSlice.d"

const initialState: TokenDetailsState = {
  loading: false,
  tokens: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokens: any = createAsyncThunk(
  "token/fetchTokens",
  async () => {
    const tokensMint = tokenMetaData
      .filter((token) => token.mint)
      .map((token) => token.mint)
    const tokens = await new TokenListProvider().resolve()

    const tokensDetails = [
      {
        name: "Solana",
        symbol: "SOL",
        image:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        mint: "solana",
        decimal: 18,
        coingeckoId: "solana"
      },
      ...tokens
        .filterByClusterSlug(getRPCNetwork())
        .getList()
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
    const tokensPrice = await getTokensUSDPrice(tokensDetails)
    const tokensWithPrice = tokensDetails.map((token) => ({
      ...token,
      usdPrice: tokensPrice[token.mint]
    }))
    return tokensWithPrice
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
  }
})

export default tokenSlice.reducer
