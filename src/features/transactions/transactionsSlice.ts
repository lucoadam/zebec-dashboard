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
  recentTransactions: {
    count: number
    next: string
    previous: string
    results: any[]
  }
  overallActivity: any
  weeklyActivity: any
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
  recentTransactions: {
    count: 0,
    next: "",
    previous: "",
    results: []
  },
  overallActivity: {},
  weeklyActivity: {},
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

export const fetchOutgoingTransactionsById: any = createAsyncThunk(
  "transactions/fetchOutgoingTransactionsById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (uuid: string) => {
    const { data: response } = await api.get(`/transaction/${uuid}/`)
    console.log(response)
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

export const fetchRecentTransactions: any = createAsyncThunk(
  "transactions/fetchRecentTransactions",
  async () => {
    const { data: response } = await api.get("/transaction/", {
      params: {
        limit: 3,
        offset: 0,
        timed_status: "ongoing"
      }
    })
    return response
  }
)

export const fetchOverallActivity: any = createAsyncThunk(
  "transactions/fetchOverallActivity",
  async () => {
    const { data: response } = await api.get("/transaction/total/")
    return response
  }
)

export const fetchWeeklyActivity: any = createAsyncThunk(
  "transactions/fetchWeeklyActivity",
  async () => {
    const { data: response } = await api.get("/transaction/weekly/")
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
    //fetchOutgoingTransactionsById
    builder.addCase(fetchOutgoingTransactionsById.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchOutgoingTransactionsById.fulfilled,
      (state, action) => {
        state.loading = false
        state.error = ""
        // state.outgoingTransactions = action.payload
        state.outgoingTransactions.results =
          state.outgoingTransactions.results.map((item) => {
            if (item.id === action.payload.id) {
              return action.payload
            }
            return item
          })
        state.pagination.total = action.payload.count
      }
    )
    builder.addCase(fetchOutgoingTransactionsById.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    //incomingTransactions
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
    //recentTransactions
    builder.addCase(fetchRecentTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchRecentTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.recentTransactions = action.payload
    })
    builder.addCase(fetchRecentTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })

    //overallActivity
    builder.addCase(fetchOverallActivity.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchOverallActivity.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.overallActivity = action.payload
    })
    builder.addCase(fetchOverallActivity.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })

    //weeklyActivity
    builder.addCase(fetchWeeklyActivity.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchWeeklyActivity.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.weeklyActivity = action.payload
    })
    builder.addCase(fetchWeeklyActivity.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
  }
})

export const { setPagination } = transactionsSlice.actions

export default transactionsSlice.reducer
