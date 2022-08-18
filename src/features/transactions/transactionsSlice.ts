/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { RootState } from "app/store"
import { PaginationInterface } from "components/shared"

interface TransactionState {
  loading: boolean
  error: string
  outgoingTransactions: {
    count: number
    next: string
    previous: string
    results: any[]
  }
  incomingTransactions: {
    count: number
    next: string
    previous: string
    results: any[]
  }
  pagination: PaginationInterface
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
  incomingTransactions: {
    count: 0,
    next: "",
    previous: "",
    results: []
  },
  pagination: {
    currentPage: 1,
    limit: 10,
    total: 0
  }
}

export const fetchOutgoingTransactions: any = createAsyncThunk(
  "transactions/fetchOutgoingTransactions",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_, { getState }) => {
    const { transactions } = getState() as RootState
    const { data: response } = await api.get("/transaction/", {
      params: {
        limit: transactions.pagination.limit,
        kind: "outgoing",
        offset:
          (Number(transactions.pagination.currentPage) - 1) *
          transactions.pagination.limit
      }
    })
    return response
  }
)

export const fetchIncomingTransactions: any = createAsyncThunk(
  "transactions/fetchIncomingTransactions",
  async (_, { getState }) => {
    const { transactions } = getState() as RootState
    const { data: response } = await api.get("/transaction/", {
      params: {
        limit: transactions.pagination.limit,
        kind: "incoming",
        offset:
          (Number(transactions.pagination.currentPage) - 1) *
          transactions.pagination.limit
      }
    })
    return response
  }
)

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setPagination: (state, action: PayloadAction<PaginationInterface>) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      }
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
      state.pagination.total = action.payload.count
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
      state.pagination.total = action.payload.count
    })
    builder.addCase(fetchIncomingTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
  }
})

export const { setPagination } = transactionsSlice.actions

export default transactionsSlice.reducer
