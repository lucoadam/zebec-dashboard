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
export const resumeTransaction = createAsyncThunk(
  "resume/resumeTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resumeTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(resumeTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(resumeTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default resumeSlice.reducer
