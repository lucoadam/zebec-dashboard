import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface ResumeState {
  show: boolean
  loading: boolean,
  error: string
}

const initialState: ResumeState = {
  show: false,
  loading: false,
  error: ""
}
export const resumeTransaction = createAsyncThunk(
  "resume/resumeTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const resumeModalSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleResumeModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
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

export const { showModal, toggleResumeModal, setLoading } =
  resumeModalSlice.actions

export default resumeModalSlice.reducer
