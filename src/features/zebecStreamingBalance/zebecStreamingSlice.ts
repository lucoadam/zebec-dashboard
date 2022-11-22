import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { RootState } from "app/store"
import { StreamingTokenState } from "./zebecStreamingSlice.d"
import {
  ZebecNativeStream,
  ZebecTokenStream
} from "zebec-anchor-sdk-npmtest/packages/stream"

const initialState: StreamingTokenState = {
  loading: false,
  tokens: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
export const fetchZebecStreamingBalance = createAsyncThunk<
  any,
  {
    wallet: string
    stream: ZebecNativeStream
    token: ZebecTokenStream
    network?: string
  },
  { state: RootState }
>("balance/fetchZebecStreamingBalance", async (data, { getState }) => {
  try {
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens.filter(
      (token) => token.network === data.network && token.chainId === "solana"
    )
    const streamingBalance: {
      symbol: string
      balance: number
    }[] = await Promise.all(
      tokens.map(async (token) => {
        let amount
        if (token.symbol === "SOL") {
          const response = await data.stream.fetchStreamingAmount({
            sender: data.wallet
          })
          amount = response.amount.toString() / LAMPORTS_PER_SOL
        } else {
          const response = await data.token.fetchStreamingAmount({
            sender: data.wallet,
            token_mint_address: token.mint
          })
          amount = response.amount.toString() / 10 ** token.decimal
        }
        return {
          symbol: token.symbol,
          balance: Number(amount)
        }
      })
    )
    return streamingBalance
  } catch (error) {
    throw error
  }
})

const streamingBalanceSlice = createSlice({
  name: "zebecStreamingBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchZebecStreamingBalance.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchZebecStreamingBalance.fulfilled,
      (state, action: PayloadAction<typeof initialState.tokens>) => {
        state.loading = false
        state.tokens = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchZebecStreamingBalance.rejected, (state, action) => {
      state.loading = false
      state.tokens = []
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default streamingBalanceSlice.reducer
