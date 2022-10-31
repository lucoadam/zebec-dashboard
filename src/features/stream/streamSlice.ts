/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "api/api"
import { AppDispatch, RootState } from "app/store"
// import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { fetchOutgoingTransactions } from "features/transactions/transactionsSlice"
import {
  fetchTreasuryVaultContinuousTransactions,
  fetchTreasuryVaultInstantTransactions
} from "features/treasuryTransactions/treasuryTransactionsSlice"

interface SendState {
  loading: boolean
  error: string
}

const initialState: SendState = {
  loading: false,
  error: ""
}

export const sendContinuousStream: any = createAsyncThunk(
  "send/sendContinuousStream",
  async (data: any, { dispatch }) => {
    await api.post("/transaction/", data)
    dispatch(fetchOutgoingTransactions())
    return
  }
)

export const sendTreasuryContinuousStream = createAsyncThunk<
  any,
  any,
  { dispatch: AppDispatch; state: RootState }
>("send/sendTreasuryContinuousStream", async (data, { dispatch, getState }) => {
  const { treasury } = getState()
  if (treasury.activeTreasury?.uuid) {
    const uuid = treasury.activeTreasury.uuid
    await api.post(`/treasury/${uuid}/vault-streaming-transactions/`, data)
    dispatch(fetchTreasuryVaultContinuousTransactions({ treasury_uuid: uuid }))
    return
  }
  return
})

export const sendTreasuryInstantTransfer = createAsyncThunk<
  any,
  any,
  { dispatch: AppDispatch; state: RootState }
>("send/sendTreasuryInstantTransfer", async (data, { dispatch, getState }) => {
  const { treasury } = getState()
  if (treasury.activeTreasury?.uuid) {
    const uuid = treasury.activeTreasury.uuid
    await api.post(`/treasury/${uuid}/vault-instant-transactions/`, data)
    dispatch(fetchTreasuryVaultInstantTransactions({ treasury_uuid: uuid }))
    return
  }
  return
})

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Continuous Stream
    builder.addCase(sendContinuousStream.pending, (state) => {
      state.loading = true
    })
    builder.addCase(sendContinuousStream.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(sendContinuousStream.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    // Treasury Continuous Stream
    builder.addCase(sendTreasuryContinuousStream.pending, (state) => {
      state.loading = true
    })
    builder.addCase(sendTreasuryContinuousStream.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(sendTreasuryContinuousStream.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    //Treasury Instant Stream
    builder.addCase(sendTreasuryInstantTransfer.pending, (state) => {
      state.loading = true
    })
    builder.addCase(sendTreasuryInstantTransfer.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(sendTreasuryInstantTransfer.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default streamSlice.reducer
