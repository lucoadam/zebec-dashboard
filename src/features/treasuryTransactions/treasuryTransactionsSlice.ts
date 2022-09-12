import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { AppDispatch, RootState } from "app/store"

interface TransactionState {
  loading: boolean
  error: string
  pendingTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
}

const initialState: TransactionState = {
  loading: false,
  error: "",
  pendingTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  }
}

export const fetchPendingTransactions = createAsyncThunk<
  any,
  null,
  { state: RootState }
>("treasuryTransactions/fetchPendingTransactions", async (_, { getState }) => {
  const { treasuryTransactions } = getState()
  console.log(treasuryTransactions)
  // const response = await api.get(``)
  return {
    count: 0,
    next: "",
    previous: "",
    results: []
  }
})

export const treasuryTransactionsSlice = createSlice({
  name: "treasuryTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPendingTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchPendingTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.pendingTransactions = action.payload
    })
    builder.addCase(fetchPendingTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
  }
})

export default treasuryTransactionsSlice.reducer
