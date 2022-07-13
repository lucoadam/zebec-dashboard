import { createSlice, PayloadAction } from "@reduxjs/toolkit"

//declare types for state
interface PauseState {
  show: boolean
  loading: boolean
}

const initialState: PauseState = {
  show: false,
  loading: false
}

export const pauseModalSlice = createSlice({
  name: "pause",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    togglePauseModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  }
})

export const { showModal, togglePauseModal, setLoading } = pauseModalSlice.actions

export default pauseModalSlice.reducer
