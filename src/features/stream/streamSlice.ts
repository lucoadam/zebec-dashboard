/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

interface SendState {
  loading: boolean
  error: string
}

const initialState: SendState = {
  loading: false,
  error: ""
}

export const sendContinuousStream: any = createAsyncThunk(
  "send/sendContinuousStream",
  async (data: any) => {
    console.log("sendContinuousStream", data)
    const { data: response } = await axios.post(
      "https://internal-ten-cherry.glitch.me/transactions",
      {
        ...data,
        is_transaction_resumed: false,
        pda: "GzPuKfEzUHi9TWXvHTW7xxy4vrTp15uPetGsEhFJKV9P",
        remaining_amount: 0.0,
        remaining_time_in_seconds: 0.0,
        sent_token: 0.0,
        status: "ongoing",
        token: data.token_mint_address,
        token_name: data.symbol,
        total_amount_tranfer_per_seconds: 0.0016666666666666668,
        total_time_in_seconds: 120,
        transaction_id:
          "2biwjVTEW5bUst8WoZYgWHMKvcWPwi5MpR2kgqoHsgon8nvfGE1iyk5MmQnhuFa8zh7vAGuu9stDg2tEGZan474M",
        transaction_type: "continuous",
        withdrawn: 0.0
      }
    )
    return response
  }
)

export const sendTreasuryContinuousStream: any = createAsyncThunk(
  "send/sendTreasuryContinuousStream",
  async (data) => {
    console.log(data)
    const { data: response } = await axios.post(
      "https://jsonplaceholder.typicode.com/streams",
      data
    )
    return response
  }
)

export const sendTreasuryInstantTransfer: any = createAsyncThunk(
  "send/sendTreasuryInstantTransfer",
  async (data) => {
    console.log(data)
    const { data: response } = await axios.post(
      "https://jsonplaceholder.typicode.com/stream",
      data
    )
    return response
  }
)

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendContinuousStream.pending, (state) => {
      state.loading = true
    })
    builder.addCase(sendContinuousStream.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      console.log("action", JSON.stringify(action, null, 2))
    })
    builder.addCase(sendContinuousStream.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    builder.addCase(sendTreasuryContinuousStream.pending, (state) => {
      state.loading = true
    })
    builder.addCase(sendTreasuryContinuousStream.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(sendTreasuryContinuousStream.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    builder.addCase(sendTreasuryInstantTransfer.pending, (state) => {
      state.loading = true
    })
    builder.addCase(sendTreasuryInstantTransfer.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(sendTreasuryInstantTransfer.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default streamSlice.reducer
