import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface PauseState {
  show: boolean
  loading: boolean,
  error:string
}

const initialState: PauseState = {
  show: false,
  loading: false,
  error:""

}
export const pauseTransaction = createAsyncThunk(
  "pause/pauseTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const pauseModalSlice = createSlice({
  name: "pause",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    togglePauseModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
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

export const { showModal, togglePauseModal, setLoading } =
  pauseModalSlice.actions

export default pauseModalSlice.reducer
