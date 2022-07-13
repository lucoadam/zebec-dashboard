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
export const pauseTransaction = createAsyncThunk(
  "pause/pauseTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

const pauseSlice = createSlice({
  name: "pause",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(pauseTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(pauseTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(pauseTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default pauseSlice.reducer
