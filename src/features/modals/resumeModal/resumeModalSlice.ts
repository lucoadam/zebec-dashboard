import { createSlice, PayloadAction } from "@reduxjs/toolkit"

//declare types for state
interface ResumeState {
  show: boolean
  loading: boolean
}

const initialState: ResumeState = {
  show: false,
  loading: false
}

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
  }
})

export const { showModal, toggleResumeModal, setLoading } =
  resumeModalSlice.actions

export default resumeModalSlice.reducer
