import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface CancelState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: CancelState = {
  show: false,
  loading: false,
  error: ""
}
export const cancelTransaction = createAsyncThunk(
  "cancel/cancelTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const cancelModalSlice = createSlice({
  name: "cancel",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleCancelModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(cancelTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const { showModal, toggleCancelModal, setLoading } =
  cancelModalSlice.actions

export default cancelModalSlice.reducer
