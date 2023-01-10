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
    symbol: "WZBC",
    name: "Wormhole Zebec",
    decimal: 9,
    mint: "0xe12823c93D6E7B7f56e5740a8ba0eF8EDC82D1eb",
    coingeco_id: "zebec-protocol",
    chain_id: "97",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "WZBC",
    name: "Wormhole Zebec",
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

const bscTokensMainnet = [
  {
    symbol: "WSOL",
    name: "Wrapped Solana",
    decimal: 9,
    mint: "So11111111111111111111111111111111111111112",
    coingeco_id: "solana",
    chain_id: "solana",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "WWSOL",
    name: "Wormhole Wrapped SOL",
    decimal: 9,
    mint: "0xfA54fF1a158B5189Ebba6ae130CEd6bbd3aEA76e",
    coingeco_id: "solana",
    chain_id: "56",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    decimal: 18,
    mint: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    coingeco_id: "binancecoin",
    chain_id: "56",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "WBNB",
    name: "Wormhole Binance Coin",
    decimal: 8,
    mint: "9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa",
    coingeco_id: "binancecoin",
    chain_id: "solana",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "ZBC",
    name: "Zebec Token",
    decimal: 9,
    mint: "0x37a56cdcD83Dce2868f721De58cB3830C44C6303",
    coingeco_id: "zebec-protocol",
    chain_id: "56",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "WZBC",
    name: "Wormhole Zebec Token",
    decimal: 9,
    mint: "wzbcJyhGhQDLTV1S99apZiiBdE4jmYfbw99saMMdP59",
    coingeco_id: "zebec-protocol",
    chain_id: "solana",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "BUSD",
    name: "Binance Coin",
    decimal: 18,
    mint: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    coingeco_id: "binance-usd",
    chain_id: "56",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "WBUSD",
    name: "Wormhole Binance Coin",
    decimal: 8,
    mint: "5RpUwQ8wtdPCZHhu6MERp2RGrpobsbZ6MH5dDHkUjs2",
    coingeco_id: "binance-usd",
    chain_id: "solana",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "USDT",
    name: "Binance USDT Coin",
    decimal: 18,
    mint: "0x55d398326f99059fF775485246999027B3197955",
    coingeco_id: "tether",
    chain_id: "56",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "WUSDT",
    name: "Wormhole USDT Coin",
    decimal: 8,
    mint: "8qJSyQprMC57TWKaYEmetUR3UUiTP2M3hXdcvFhkZdmv",
    coingeco_id: "tether",
    chain_id: "solana",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "HAY",
    name: "Hay DestableCoin",
    decimal: 18,
    mint: "0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5",
    coingeco_id: "helio-protocol-hay",
    chain_id: "56",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "WHAY",
    name: "Wormhole Hay Destable Coin",
    decimal: 8,
    mint: "Eh4ZP3fJQRCX3xeGUvrbNtajGumFgT978A1pWZURqYuw",
    coingeco_id: "helio-protocol-hay",
    chain_id: "solana",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "LEON",
    name: "Leon Token",
    decimal: 18,
    mint: "0x27E873bee690C8E161813DE3566E9E18a64b0381",
    coingeco_id: "leon-token",
    chain_id: "56",
    network: "Binance Smart Chain Mainnet"
  },
  {
    symbol: "WLEON",
    name: "Wormhole Leon Token",
    decimal: 9,
    mint: "CKcFJYasJFgLwvgFJrk4zgAZhwiR7z4jb4s7iFrkvQ8M",
    coingeco_id: "leon-token",
    chain_id: "solana",
    network: "Binance Smart Chain Mainnet"
  }
]
//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export const fetchTokens = createAsyncThunk<any, void, {}>(
  "token/fetchTokens",
  async () => {
    const response = await api.get(`/token/`)
    const tokenDetails: TokenResponse[] = response.data
    const tokens = [
      ...tokenDetails.filter((token) => token.network === "solana"),
      ...(process.env.RPC_NETWORK === "mainnet" ? bscTokensMainnet : bscTokens)
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
