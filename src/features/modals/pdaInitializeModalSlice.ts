import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Props {
  showPdaInitialize: boolean
  balance: number
}

const initialState: Props = {
  showPdaInitialize: false,
  balance: 0
}

export const pdaInitializeModalSlice = createSlice({
  name: "walletApprovalMessage",
  initialState,
  reducers: {
    setShowPdaInitialize: (state, action: PayloadAction<boolean>) => {
      state.showPdaInitialize = action.payload
    },
    setPdaBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    }
  }
})

export const { setShowPdaInitialize, setPdaBalance } =
  pdaInitializeModalSlice.actions

export default pdaInitializeModalSlice.reducer
