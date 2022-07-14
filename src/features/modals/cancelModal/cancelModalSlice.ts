import { createSlice, PayloadAction } from "@reduxjs/toolkit"

//declare types for state
interface CancelState {
  show: boolean
  loading: boolean
}

const initialState: CancelState = {
  show: false,
  loading: false
}

export const cancelModalSlice = createSlice({
  name: "cancel",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleCancelModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  }
})

export const { showModal, toggleCancelModal, setLoading } =
  cancelModalSlice.actions

export default cancelModalSlice.reducer
