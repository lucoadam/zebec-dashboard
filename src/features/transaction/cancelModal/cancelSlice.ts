import { createSlice } from "@reduxjs/toolkit"
// import type { RootState } from "app/store";

//declare types for state
interface CancelState {
  cancelModal: boolean
  cancelLoading:boolean
}

const initialState: CancelState = {
  cancelModal: false,
  cancelLoading:false,
}

export const CancelSlice = createSlice({
  name: "CancelModal",
  initialState,
  reducers: {
    toggleCancelModal: (state) => {
      state.cancelModal = !state.cancelModal
    },
    toggleCancelLoading: (state,action) => {
      state.cancelLoading = action.payload
    },
  }
})

export const { toggleCancelModal,toggleCancelLoading } = CancelSlice.actions

export default CancelSlice.reducer
