import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TransferToVaultState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: TransferToVaultState = {
  show: false,
  loading: false,
  error: ""
}

export const transferToVaultModalSlice = createSlice({
  name: "transferToVault",
  initialState,
  reducers: {
    showTransferToVaultModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleTransferToVaultModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  }
})

export const {
  showTransferToVaultModal,
  toggleTransferToVaultModal,
  setLoading
} = transferToVaultModalSlice.actions

export default transferToVaultModalSlice.reducer
