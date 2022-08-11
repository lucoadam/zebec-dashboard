/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { RootState } from "app/store"
import axios from "axios"

interface TransactionState {
  loading: boolean
  error: string
  outgoingTransactions: any[]
  incomingTransactions: any[]
  incomingTotal: number
  outgoingTotal: number
  limit: number
  incomingCurrentPage: number
  outgoingCurrentPage: number
}

const initialState: TransactionState = {
  loading: false,
  error: "",
  outgoingTransactions: [],
  incomingTransactions: [],
  incomingTotal: 0,
  outgoingTotal: 0,
  limit: 5,
  incomingCurrentPage: 1,
  outgoingCurrentPage: 1
}

export const fetchOutgoingTransactions: any = createAsyncThunk(
  "transactions/fetchOutgoingTransactions",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (sender: string, { getState }) => {
    // const { data: response } = await axios.get(
    //   `https://internal-ten-cherry.glitch.me/transactions?sender=${sender}`
    // )
    const { transactions } = getState() as RootState
    const { data: response } = await api.get(
      `/transaction/?limit=${transactions.limit}&offset=${
        (transactions.outgoingCurrentPage - 1) * transactions.limit
      }`
    )
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
  reducers: {
    setIncomingCurrentPage: (state, action: PayloadAction<number>) => {
      state.incomingCurrentPage = action.payload
    },
    setOutgoingCurrentPage: (state, action: PayloadAction<number>) => {
      state.outgoingCurrentPage = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    }
  },
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

export const { setIncomingCurrentPage, setOutgoingCurrentPage, setLimit } =
  transactionsSlice.actions

export default transactionsSlice.reducer
