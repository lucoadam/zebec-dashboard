import { createSlice } from "@reduxjs/toolkit"
// import type { RootState } from "app/store";

//declare types for state
interface ResumeState {
  resumeModal: boolean,
  resumeLoadingModal:boolean
}

const initialState: ResumeState = {
  resumeModal: false,
  resumeLoadingModal:false
}

export const ResumeSlice = createSlice({
  name: "ResumeModal",
  initialState,
  reducers: {
    toggleResumeModal: (state) => {
      state.resumeModal = !state.resumeModal
    },
    toggleResumeLoadingModal: (state,action) => {
      state.resumeLoadingModal = action.payload
    }
  }
})

export const { toggleResumeModal,toggleResumeLoadingModal } = ResumeSlice.actions

export default ResumeSlice.reducer
