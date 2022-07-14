import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
export const modalTransaction = createAsyncThunk(
  "modal/modalTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(modalTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(modalTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(modalTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default modalSlice.reducer
