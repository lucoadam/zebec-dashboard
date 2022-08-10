/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "api/api"
import axios from "axios"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { fetchOutgoingTransactions } from "features/transactions/transactionsSlice"

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
    // const { data: response } = await axios.post(
    //   "https://internal-ten-cherry.glitch.me/transactions",
    //   data
    // )
    const { data: response } = await api.post("/transaction/", data)
    dispatch(fetchOutgoingTransactions(data.sender))
    dispatch(toggleWalletApprovalMessageModal())
    return response
  }
)

export const sendTreasuryContinuousStream: any = createAsyncThunk(
  "send/sendTreasuryContinuousStream",
  async (data) => {
    console.log(data)
    const { data: response } = await axios.post(
      "https://jsonplaceholder.typicode.com/streams",
      data
    )
    return response
  }
)

export const sendTreasuryInstantTransfer: any = createAsyncThunk(
  "send/sendTreasuryInstantTransfer",
  async (data) => {
    console.log(data)
    const { data: response } = await axios.post(
      "https://jsonplaceholder.typicode.com/stream",
      data
    )
    return response
  }
)

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
