/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

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
  async (data) => {
    console.log(data)
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/streams"
    )
    return response
  }
)

export const sendTreasuryContinuousStream: any = createAsyncThunk(
  "send/sendTreasuryContinuousStream",
  async (data) => {
    console.log(data)
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/streams"
    )
    return response
  }
)

export const sendTreasuryInstantTransfer: any = createAsyncThunk(
  "send/sendTreasuryInstantTransfer",
  async (data) => {
    console.log(data)
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/stream"
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
      state.error = action.error.message ?? "Something went wrong"
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
