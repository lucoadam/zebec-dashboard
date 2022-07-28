/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

interface TransactionState {
  loading: boolean
  error: string
  outgoingTransactions: any[]
}

const initialState: TransactionState = {
  loading: false,
  error: "",
  outgoingTransactions: []
}

export const fetchOutgoingTransactions: any = createAsyncThunk(
  "transactions/fetchTransactions",
  async (sender: string) => {
    const { data: response } = await axios.get(
      `https://internal-ten-cherry.glitch.me/transactions?sender=${sender}`
    )
    return response
  }
)

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOutgoingTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchOutgoingTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.outgoingTransactions = action.payload
    })
    builder.addCase(fetchOutgoingTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
  }
})

export default transactionsSlice.reducer
