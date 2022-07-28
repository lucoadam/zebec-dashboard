/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

interface SendState {
  loading: boolean
  error: string
  outgoingTransactions: any[]
}

const initialState: SendState = {
  loading: false,
  error: "",
  outgoingTransactions: [
    {
      amount: 0.1,
      end_time: 1658992920,
      file: undefined,
      pda: "CWqPk4HvzkJ8AaSmuWRuxyzWz2HkupSR5qLZSyVtbA6A",
      receiver: "7VBTMgbXbnz3gXjCjADM3dzJYsidSRw453mcXV1CfcRj",
      remarks: undefined,
      sender: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      start_time: 1658992860,
      symbol: "SOL",
      token_mint_address: "",
      transaction_name: "dd"
    }
  ]
}

export const sendContinuousStream: any = createAsyncThunk(
  "send/sendContinuousStream",
  async (data) => {
    console.log(data)
    // const response = await axios.post(
    //   "https://jsonplaceholder.typicode.com/streams",
    //   data
    // )
    return data
  }
)

export const sendTreasuryContinuousStream: any = createAsyncThunk(
  "send/sendTreasuryContinuousStream",
  async (data) => {
    console.log(data)
    const response = await axios.post(
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
    const response = await axios.post(
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
      state.outgoingTransactions = [
        ...state.outgoingTransactions,
        action.payload
      ]
    })
    builder.addCase(sendContinuousStream.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
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
