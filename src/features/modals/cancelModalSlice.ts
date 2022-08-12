import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { fetchOutgoingTransactions } from "features/transactions/transactionsSlice"

//declare types for state
interface CancelState {
  transaction: any
  show: boolean
  loading: boolean
  error: string
}

const initialState: CancelState = {
  transaction: null,
  show: false,
  loading: false,
  error: ""
}
export const cancelTransaction = createAsyncThunk(
  "cancel/cancelTransaction",
  async (uuid: string, { dispatch }) => {
    const response = await api.patch(`/transaction/${uuid}/`, {
      status: "cancelled"
    })
    dispatch(fetchOutgoingTransactions())
    return response.data
  }
)

export const cancelModalSlice = createSlice({
  name: "cancel",
  initialState,
  reducers: {
    showCancelModal: (
      state,
      action: PayloadAction<typeof initialState.transaction>
    ) => {
      state.show = true
      state.loading = false
      state.transaction = action.payload
    },
    toggleCancelModal: (state) => {
      state.show = !state.show
      state.transaction = state.show ? null : state.transaction
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(cancelTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(cancelTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(cancelTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showCancelModal, toggleCancelModal, setLoading } =
  cancelModalSlice.actions

export default cancelModalSlice.reducer
