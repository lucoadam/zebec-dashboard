import { createSlice } from "@reduxjs/toolkit"

interface StepList {
  name: string
}

interface xWalletApprovalMessageProps {
  show: boolean
  step: number
  StepsList: StepList[]
  message: string
}

const initialState: xWalletApprovalMessageProps = {
  show: false,
  step: 0,
  message:
    "Please complete all steps to ensure successful deposit of funds to your zebec vault",
  StepsList: [
    {
      name: "Approve Deposit"
    },
    {
      name: "Transfer to PDA"
    },
    {
      name: "Transfer to Zebec Vault"
    }
  ]
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
    },
    setXModalStepsList: (state, action) => {
      state.StepsList = action.payload as StepList[]
    },
    setXModalMessage: (state, action) => {
      state.message = action.payload.toString()
    }
  }
})

export const {
  togglexWalletApprovalMessageModal,
  switchxWalletApprovalMessageStep,
  setXModalStepsList,
  setXModalMessage
} = xWalletApprovalMessageSlice.actions

export default xWalletApprovalMessageSlice.reducer
