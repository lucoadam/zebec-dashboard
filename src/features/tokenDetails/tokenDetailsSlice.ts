import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
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

const bscTokens = [
  {
    symbol: "WSOL",
    name: "Wrapped Solana",
    decimal: 9,
    mint: "So11111111111111111111111111111111111111112",
    coingeco_id: "solana",
    chain_id: "solana",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "WWSOL",
    name: "Wormhole Wrapped SOL",
    decimal: 9,
    mint: "0x30f19eBba919954FDc020B8A20aEF13ab5e02Af0",
    coingeco_id: "solana",
    chain_id: "97",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "USDT",
    name: "BSC USDT",
    decimal: 18,
    mint: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    coingeco_id: "tether",
    chain_id: "97",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "ZBC",
    name: "Zebec",
    decimal: 9,
    mint: "0xe12823c93D6E7B7f56e5740a8ba0eF8EDC82D1eb",
    coingeco_id: "zebec-protocol",
    chain_id: "97",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "ZBC",
    name: "Zebec",
    decimal: 9,
    mint: "AbLwGR8A1wvsiLWrzzA5eYPoQw51NVMcMMTPvAv5LTJ",
    coingeco_id: "zebec-protocol",
    chain_id: "solana",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "USDT",
    name: "BSC USDT",
    decimal: 8,
    mint: "F6d4we2yt9DxPwYbo18YG4bGDxMFpghQcgYWsoJTmtia",
    coingeco_id: "tether",
    chain_id: "solana",
    network: "Binance Smart Chain Testnet"
  }
]

//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export const fetchTokens = createAsyncThunk<any, void, {}>(
  "token/fetchTokens",
  async () => {
    const response = await api.get(`/token/`)
    const tokenDetails: TokenResponse[] = response.data
    console.log("tokenDetails", tokenDetails)
    const tokens = [
      ...tokenDetails.filter((token) => token.network === "solana"),
      ...bscTokens
    ].map((res) => ({
      name: res.name,
      symbol: res.symbol,
      decimal: res.decimal,
      mint: res.mint,
      coingeckoId: res.coingeco_id,
      chainId: res.chain_id,
      network: res.network
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
