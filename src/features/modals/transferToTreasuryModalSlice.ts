import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TransferToTreasuryState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: TransferToTreasuryState = {
  show: false,
  loading: false,
  error: ""
}

export const transferToTreasuryModalSlice = createSlice({
  name: "transferToTreasury",
  initialState,
  reducers: {
    showTransferToTreasuryModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleTransferToTreasuryModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  }
})

export const {
  showTransferToTreasuryModal,
  toggleTransferToTreasuryModal,
  setLoading
} = transferToTreasuryModalSlice.actions

export default transferToTreasuryModalSlice.reducer
