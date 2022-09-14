import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "api/api"

interface TransactionState {
  loading: boolean
  error: string
  transactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
}

const initialState: TransactionState = {
  loading: false,
  error: "",
  transactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  }
}

export const fetchTreasuryPendingTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string },
  {}
>("treasuryTransactions/fetchTransactions", async ({ treasury_uuid }, {}) => {
  const response = await api.get(`/treasury/${treasury_uuid}/transactions/`)
  return response.data
})

export const treasuryTransactionsSlice = createSlice({
  name: "treasuryTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTreasuryPendingTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTreasuryPendingTransactions.fulfilled,
      (state, action) => {
        state.loading = false
        state.error = ""
        state.transactions = action.payload
      }
    )
    builder.addCase(
      fetchTreasuryPendingTransactions.rejected,
      (state, action) => {
        state.loading = false
        state.error = action?.error?.message ?? "Something went wrong"
      }
    )
  }
})

export default treasuryTransactionsSlice.reducer
