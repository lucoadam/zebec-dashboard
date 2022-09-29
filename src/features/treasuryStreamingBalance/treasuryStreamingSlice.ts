import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { RootState } from "app/store"
import {
  ZebecNativeStream,
  ZebecTokenStream
} from "zebec-anchor-sdk-npmtest/packages/stream"
import { StreamingTokenState } from "./treasuryStreamingSlice.d"

const initialState: StreamingTokenState = {
  loading: false,
  tokens: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTreasuryStreamingBalance = createAsyncThunk<
  any,
  {
    wallet: string
    stream: ZebecNativeStream
    token: ZebecTokenStream
  },
  { state: RootState }
>("balance/fetchTreasuryStreamingBalance", async (data, { getState }) => {
  try {
    const { tokenDetails } = getState() as RootState
    const tokens = tokenDetails.tokens
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
  name: "treasuryStreamingBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTreasuryStreamingBalance.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTreasuryStreamingBalance.fulfilled,
      (state, action: PayloadAction<typeof initialState.tokens>) => {
        state.loading = false
        state.tokens = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchTreasuryStreamingBalance.rejected, (state, action) => {
      state.loading = false
      state.tokens = []
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default streamingBalanceSlice.reducer
