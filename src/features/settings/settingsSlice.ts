import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import axios from "axios"

//declare types for state
interface SettingsState {
  email: string
  explorer: string
  loading: boolean
  error: string
}

const initialState: SettingsState = {
  email: "",
  explorer: "",
  loading: false,
  error: ""
}
export const saveEmailSettings = createAsyncThunk(
  "settings/saveEmailSettings",
  async (data: { email: string }) => {
    await axios.post("url", data)
    return data.email
  }
)

export const saveExplorerSettings = createAsyncThunk(
  "settings/saveExplorerSettings",
  async (data: { explorer: string }) => {
    const response = await api.put("/user/preferences/0/", data)
    return response.data.explorer
  }
)

export const getPreferences = createAsyncThunk(
  "settings/getPreferences",
  async () => {
    const response = await api.get("/user/preferences/0/")
    return response.data
  }
)

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(saveEmailSettings.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(
      saveEmailSettings.fulfilled,
      (state, action: PayloadAction<typeof initialState.email>) => {
        state.loading = false
        state.error = ""
        state.email = action.payload
      }
    )
    builder.addCase(saveEmailSettings.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    builder.addCase(saveExplorerSettings.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(
      saveExplorerSettings.fulfilled,
      (state, action: PayloadAction<typeof initialState.explorer>) => {
        state.loading = false
        state.error = ""
        state.explorer = action.payload
      }
    )
    builder.addCase(saveExplorerSettings.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    builder.addCase(getPreferences.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(
      getPreferences.fulfilled,
      (state, action: PayloadAction<typeof initialState>) => {
        state.loading = false
        state.error = ""
        state.explorer = action.payload.explorer || ""
        state.email = action.payload.email || ""
      }
    )
    builder.addCase(getPreferences.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default settingsSlice.reducer
