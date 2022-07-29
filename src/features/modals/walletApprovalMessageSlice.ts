import { createSlice } from "@reduxjs/toolkit"

interface WalletApprovalMessageProps {
  show: boolean
}

const initialState: WalletApprovalMessageProps = {
  show: false
}

export const walletApprovalMessageSlice = createSlice({
  name: "walletApprovalMessage",
  initialState,
  reducers: {
    toggleWalletApprovalMessageModal: (state) => {
      state.show = !state.show
    }
  }
})

export const { toggleWalletApprovalMessageModal } =
  walletApprovalMessageSlice.actions

export default walletApprovalMessageSlice.reducer
