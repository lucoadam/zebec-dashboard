import { createSlice } from "@reduxjs/toolkit"
// import type { RootState } from "app/store";

//declare types for state
interface CancelState {
  cancelModal: boolean
}

const initialState: CancelState = {
  cancelModal: false
}

export const CancelSlice = createSlice({
  name: "CancelModal",
  initialState,
  reducers: {
    toggleCancelModal: (state) => {
      state.cancelModal = !state.cancelModal
    }
  }
})

export const { toggleCancelModal } = CancelSlice.actions

export default CancelSlice.reducer
