import { createSlice, PayloadAction } from "@reduxjs/toolkit"

//declare types for state
interface ModalState {
  show: boolean
  loading: boolean
}

const initialState: ModalState = {
  show: false,
  loading: false
}

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  }
})

export const { showModal, toggleModal, setLoading } = modalSlice.actions

export default modalSlice.reducer
