import { createSlice } from "@reduxjs/toolkit"
// import type { RootState } from "app/store";

//declare types for state
interface ResumeState {
  resumeModal: boolean
}

const initialState: ResumeState = {
  resumeModal: false
}

export const ResumeSlice = createSlice({
  name: "ResumeModal",
  initialState,
  reducers: {
    toggleResumeModal: (state) => {
      state.resumeModal = !state.resumeModal
    }
  }
})

export const { toggleResumeModal } = ResumeSlice.actions

export default ResumeSlice.reducer
