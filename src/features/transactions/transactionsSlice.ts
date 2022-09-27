/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { RootState } from "app/store"
import { PaginationInterface } from "components/shared"
// import axios from "axios"

interface TransactionState {
  loading: boolean
  error: string
  outgoingTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  incomingTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  recentTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  completedTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  ongoingTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  scheduledTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  overallActivity: any
  weeklyActivity: any
  pagination: PaginationInterface
  initiatedTransactions: string[]
}

const initialState: TransactionState = {
  loading: false,
  error: "",
  outgoingTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  },
  incomingTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  },
  recentTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  },
  completedTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  },
  ongoingTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  },
  scheduledTransactions: {
    count: null,
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
  },
  initiatedTransactions: []
}

export const fetchOutgoingTransactions: any = createAsyncThunk(
  "transactions/fetchOutgoingTransactions",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (wallet: string, { getState }) => {
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
    // const { data: response } = await axios.get(
    //   `https://internal-ten-cherry.glitch.me/transactions?sender=${wallet}`
    // )
    // return {
    //   count: response.length,
    //   next: "",
    //   previous: "",
    //   results: response
    // }
    return response
  }
)

export const fetchOutgoingTransactionsById: any = createAsyncThunk(
  "transactions/fetchOutgoingTransactionsById",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (uuid: string, { dispatch }) => {
    const { data: response } = await api.get(`/transaction/${uuid}/`)
    dispatch(removeInitiatedTransactions(uuid))
    return response
  }
)

export const fetchIncomingTransactions: any = createAsyncThunk(
  "transactions/fetchIncomingTransactions",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (wallet: string, { getState }) => {
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
    // const { data: response } = await axios.get(
    //   `https://internal-ten-cherry.glitch.me/transactions?receiver=${wallet}`
    // )
    // return {
    //   count: response.length,
    //   next: "",
    //   previous: "",
    //   results: response
    // }
  }
)

export const fetchRecentTransactions: any = createAsyncThunk(
  "transactions/fetchRecentTransactions",
  async () => {
    const { data: response } = await api.get("/transaction/", {
      params: {
        limit: 3,
        offset: 0
      }
    })
    return response
  }
)

export const fetchCompletedTransactions: any = createAsyncThunk(
  "transactions/fetchCompletedTransactions",
  async (kind: "incoming" | "outgoing", { getState }) => {
    const { transactions } = getState() as RootState
    const { data: response } = await api.get("/transaction/", {
      params: {
        limit: transactions.pagination.limit,
        offset:
          (Number(transactions.pagination.currentPage) - 1) *
          transactions.pagination.limit,
        kind,
        timed_status: "completed"
      }
    })
    return response
  }
)

export const fetchOngoingTransactions: any = createAsyncThunk(
  "transactions/fetchOngoingTransactions",
  async (kind: "incoming" | "outgoing", { getState }) => {
    const { transactions } = getState() as RootState
    const { data: response } = await api.get("/transaction/", {
      params: {
        limit: transactions.pagination.limit,
        offset:
          (Number(transactions.pagination.currentPage) - 1) *
          transactions.pagination.limit,
        kind,
        timed_status: "ongoing"
      }
    })
    return response
  }
)

export const fetchScheduledTransactions: any = createAsyncThunk(
  "transactions/fetchScheduledTransactions",
  async (kind: "incoming" | "outgoing", { getState }) => {
    const { transactions } = getState() as RootState
    const { data: response } = await api.get("/transaction/", {
      params: {
        limit: transactions.pagination.limit,
        offset:
          (Number(transactions.pagination.currentPage) - 1) *
          transactions.pagination.limit,
        kind,
        timed_status: "scheduled"
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
    },
    setInitiatedTransactions: (state, action: PayloadAction<string>) => {
      state.initiatedTransactions = [
        ...state.initiatedTransactions,
        action.payload
      ]
    },
    removeInitiatedTransactions: (state, action: PayloadAction<string>) => {
      state.initiatedTransactions = state.initiatedTransactions.filter(
        (initiatedTrx) => initiatedTrx !== action.payload
      )
    },
    resetTimedStatusTransactions: (state) => {
      state.completedTransactions = initialState.completedTransactions
      state.ongoingTransactions = initialState.ongoingTransactions
      state.scheduledTransactions = initialState.scheduledTransactions
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
        const newOutgoingTransactions = state.outgoingTransactions.results.map(
          (item) => {
            if (item.id === action.payload.id) {
              return action.payload
            }
            return item
          }
        )
        state.loading = false
        state.error = ""
        // state.outgoingTransactions = action.payload
        state.outgoingTransactions.results = newOutgoingTransactions
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

    //completedTransactions
    builder.addCase(fetchCompletedTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchCompletedTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.completedTransactions = action.payload
      state.pagination.total = action.payload.count
    })
    builder.addCase(fetchCompletedTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })

    //ongoingTransactions
    builder.addCase(fetchOngoingTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchOngoingTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.ongoingTransactions = action.payload
      state.pagination.total = action.payload.count
    })
    builder.addCase(fetchOngoingTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })

    //scheduledTransactions
    builder.addCase(fetchScheduledTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchScheduledTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.scheduledTransactions = action.payload
      state.pagination.total = action.payload.count
    })
    builder.addCase(fetchScheduledTransactions.rejected, (state, action) => {
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

export const {
  setPagination,
  setInitiatedTransactions,
  removeInitiatedTransactions,
  resetTimedStatusTransactions
} = transactionsSlice.actions

export default transactionsSlice.reducer
