import { createSlice } from "@reduxjs/toolkit"
// import type { RootState } from "app/store";

//declare types for state
interface PauseState {
  pauseModal: boolean,
  pauseLoading:boolean
}

const initialState: PauseState = {
  pauseModal: false,
  pauseLoading:false
}

export const PauseSlice = createSlice({
  name: "PauseModal",
  initialState,
  reducers: {
    togglePauseModal: (state) => {
      state.pauseModal = !state.pauseModal
    },
    togglePauseLoadingModal: (state,action) => {
      state.pauseLoading = action.payload
    }
  }
})

export const { togglePauseModal,togglePauseLoadingModal } = PauseSlice.actions

export default PauseSlice.reducer
