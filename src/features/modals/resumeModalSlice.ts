import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { fetchOutgoingTransactions } from "features/transactions/transactionsSlice"

//declare types for state
interface ResumeState {
  transaction: any
  show: boolean
  loading: boolean
  error: string
}

const initialState: ResumeState = {
  transaction: null,
  show: false,
  loading: false,
  error: ""
}
export const resumeTransaction = createAsyncThunk(
  "resume/resumeTransaction",
  async (uuid: string, { dispatch }) => {
    const response = await api.patch(`/transaction/${uuid}/`, {
      status: "ready"
    })
    dispatch(fetchOutgoingTransactions())
    return response.data
  }
)

export const resumeModalSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    showResumeModal: (
      state,
      action: PayloadAction<typeof initialState.transaction>
    ) => {
      state.show = true
      state.loading = false
      state.transaction = action.payload
    },
    toggleResumeModal: (state) => {
      state.show = !state.show
      state.transaction = state.show ? null : state.transaction
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resumeTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(resumeTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(resumeTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showResumeModal, toggleResumeModal, setLoading } =
  resumeModalSlice.actions

export default resumeModalSlice.reducer
