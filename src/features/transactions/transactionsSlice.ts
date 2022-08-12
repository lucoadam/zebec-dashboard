/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "api/api"
import axios from "axios"

interface TransactionState {
  loading: boolean
  error: string
  outgoingTransactions: {
    count: number
    next: string
    previous: string
    results: any[]
  }
  incomingTransactions: any[]
}

const initialState: TransactionState = {
  loading: false,
  error: "",
  outgoingTransactions: {
    count: 0,
    next: "",
    previous: "",
    results: []
  },
  incomingTransactions: []
}

export const fetchOutgoingTransactions: any = createAsyncThunk(
  "transactions/fetchOutgoingTransactions",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async () => {
    const { data: response } = await api.get(`/transaction/`)
    return response
  }
)

export const fetchIncomingTransactions: any = createAsyncThunk(
  "transactions/fetchIncomingTransactions",
  async (receiver: string) => {
    const { data: response } = await axios.get(
      `https://internal-ten-cherry.glitch.me/transactions?receiver=${receiver}`
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
    builder.addCase(fetchIncomingTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchIncomingTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.incomingTransactions = action.payload
    })
    builder.addCase(fetchIncomingTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
  }
})

export default transactionsSlice.reducer
