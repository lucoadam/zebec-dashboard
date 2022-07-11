import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface User {
  id: number
  name: string
}
interface UserState {
  loading: boolean
  users: User[]
  error: string
}

const initialState: UserState = {
  loading: false,
  users: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await axios.get("https://jsonplaceholder.typicode.com/users")
  return response.data
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<typeof initialState.users>) => {
        state.loading = false
        state.users = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false
      state.users = []
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default userSlice.reducer
