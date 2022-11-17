import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Props {
  showPdaInitialize: boolean
}

const initialState: Props = {
  showPdaInitialize: false
}

export const pdaInitializeModalSlice = createSlice({
  name: "walletApprovalMessage",
  initialState,
  reducers: {
    setShowPdaInitialize: (state, action: PayloadAction<boolean>) => {
      state.showPdaInitialize = action.payload
    }
  }
})

export const { setShowPdaInitialize } = pdaInitializeModalSlice.actions

export default pdaInitializeModalSlice.reducer
