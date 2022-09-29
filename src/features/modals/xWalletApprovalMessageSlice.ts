import { createSlice } from "@reduxjs/toolkit"

interface xWalletApprovalMessageProps {
  show: boolean
  step: number
}

const initialState: xWalletApprovalMessageProps = {
  show: false,
  step: 0
}

export const xWalletApprovalMessageSlice = createSlice({
  name: "xWalletApprovalMessage",
  initialState,
  reducers: {
    togglexWalletApprovalMessageModal: (state) => {
      state.show = !state.show
    },
    switchxWalletApprovalMessageStep: (state, action) => {
      state.step = action.payload
    }
  }
})

export const {
  togglexWalletApprovalMessageModal,
  switchxWalletApprovalMessageStep
} = xWalletApprovalMessageSlice.actions

export default xWalletApprovalMessageSlice.reducer
