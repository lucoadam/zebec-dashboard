import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { fetchTransactionsById } from "api"
import api from "api/api"
import { AppDispatch } from "app/store"

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

export const preCancelTransaction = createAsyncThunk<
  any,
  { uuid: string },
  { dispatch: AppDispatch }
>("cancel/preCancelTransaction", async (data, { dispatch }) => {
  const response = await api.patch(`/transaction/${data.uuid}/`, {
    status: "cancelled"
  })
  dispatch(fetchTransactionsById(data.uuid, "cancel"))

  return response.data
})

export const cancelTransaction = createAsyncThunk<
  any,
  { uuid: string; txn_hash?: string },
  { dispatch: AppDispatch }
>("cancel/cancelTransaction", async (data, { dispatch }) => {
  const response = await api.patch(`/transaction/${data.uuid}/`, {
    status: "cancelled",
    ...data
  })

  dispatch(fetchTransactionsById(data.uuid, "cancel"))
  dispatch(toggleCancelModal())
  return response.data
})

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
    //Pre-cancel Transaction
    builder.addCase(preCancelTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(preCancelTransaction.fulfilled, (state) => {
      state.loading = true
      state.error = ""
    })
    builder.addCase(preCancelTransaction.rejected, (state, action) => {
      state.loading = true
      state.error = action.error.message ?? "Something went wrong"
    })
    //Cancel Transaction
    builder.addCase(cancelTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(cancelTransaction.fulfilled, (state) => {
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
