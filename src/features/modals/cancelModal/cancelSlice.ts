import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface User {
  id: number
  name: string
}
interface UserState {
  loading: boolean
  error: string
}

const initialState: UserState = {
  loading: false,
  error: ""
}

//Generates pending, fulfilled and rejected action types
export const cancelTransaction = createAsyncThunk(
  "cancel/cancelTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

const cancelSlice = createSlice({
  name: "cancel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(cancelTransaction.pending, (state) => {
      state.loading = true
    })
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

export default cancelSlice.reducer
