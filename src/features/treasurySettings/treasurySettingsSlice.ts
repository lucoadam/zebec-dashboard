import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface SafeNameState {
  updating: boolean
  safeNames: string
  error: string
}

const initialState: SafeNameState = {
  updating: false,
  safeNames: "Zebec Safe",
  error: ""
}

//Generates pending, fulfilled and rejected action types
export const updateSafeName = createAsyncThunk(
  "safeName/fetchSafeName",
  async (data: { name: string }) => {
    console.log("sdlfjsd")
    const response = await axios.put(
      "https://jsonplaceholder.typicode.com/safeName"
    )
    console.log(response.data)
    return data.name
  }
)

const treasurySettingsSlice = createSlice({
  name: "treasurySettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateSafeName.pending, (state) => {
      state.updating = true
    })
    builder.addCase(
      updateSafeName.fulfilled,
      (state, action: PayloadAction<typeof initialState.safeNames>) => {
        state.updating = false
        state.safeNames = action.payload
        state.error = ""
      }
    )
    builder.addCase(updateSafeName.rejected, (state, action) => {
      state.updating = false
      // state.safeNames = ""
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default treasurySettingsSlice.reducer
