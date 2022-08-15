/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { RootState } from "app/store"

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
  limit: number
  incomingCurrentPage: number
  outgoingCurrentPage: number
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
  limit: 10,
  incomingCurrentPage: 1,
  outgoingCurrentPage: 1
}

export const fetchOutgoingTransactions: any = createAsyncThunk(
  "transactions/fetchOutgoingTransactions",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_, { getState }) => {
    const { transactions } = getState() as RootState
    const { data: response } = await api.get("/transaction/", {
      params: {
        limit: transactions.limit,
        kind: "outgoing",
        offset: (transactions.outgoingCurrentPage - 1) * transactions.limit
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
        limit: transactions.limit,
        kind: "incoming",
        offset: (transactions.incomingCurrentPage - 1) * transactions.limit
      }
    })
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
