import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenListProvider } from "@solana/spl-token-registry";
import tokenMetaData from "fakedata/tokens.json";

interface Token {
  name: string;
  symbol: number;
  image: string;
  decimal: number;
  coingeckoId?: string;
}

interface TokenState {
  loading: boolean;
  tokens: Token[];
  error: string;
}

const initialState: TokenState = {
  loading: false,
  tokens: [],
  error: "",
};

//Generates pending, fulfilled and rejected action types
export const fetchTokens: any = createAsyncThunk(
  "token/fetchTokens",
  async () => {
    const tokenSymbols = tokenMetaData.map((token) => token.symbol);
    const tokens = await new TokenListProvider().resolve();
    const tokensDetails = tokens
      .filterByClusterSlug("mainnet-beta")
      .getList()
      .filter((token) => tokenSymbols.includes(token.symbol))
      .map((token) => ({
        name: token.name,
        symbol: token.symbol,
        image: token.logoURI,
        decimal: token.decimals,
        coingeckoId: token?.extensions?.coingeckoId,
      }));
    return tokensDetails;
  }
);

const tokenSlice = createSlice({
  name: "tokenDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTokens.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchTokens.fulfilled,
      (state, action: PayloadAction<typeof initialState.tokens>) => {
        state.loading = false;
        state.tokens = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchTokens.rejected, (state, action) => {
      state.loading = false;
      state.tokens = [];
      state.error = action.error.message ?? "Something went wrong";
    });
  },
});

export default tokenSlice.reducer;
