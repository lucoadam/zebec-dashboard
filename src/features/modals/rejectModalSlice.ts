import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface RejectState {
  transaction: any
  show: boolean
  loading: boolean
  error: string
}

const initialState: RejectState = {
  transaction: null,
  show: false,
  loading: false,
  error: ""
}
export const rejectTransaction = createAsyncThunk(
  "reject/rejectTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const rejectModalSlice = createSlice({
  name: "rejectTransaction",
  initialState,
  reducers: {
    showRejectModal: (
      state,
      action: PayloadAction<typeof initialState.transaction>
    ) => {
      state.show = true
      state.loading = false
      state.transaction = action.payload
    },
    toggleRejectModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(rejectTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(rejectTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(rejectTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showRejectModal, toggleRejectModal, setLoading } =
  rejectModalSlice.actions

export default rejectModalSlice.reducer
