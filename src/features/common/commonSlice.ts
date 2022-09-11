import { createSlice, PayloadAction } from "@reduxjs/toolkit"

//declare types for state
interface CommonState {
  treasurySendActiveTab: number
  tpsValue: number
  isSigned: boolean
}

const initialState: CommonState = {
  treasurySendActiveTab: 0,
  tpsValue: 0,
  isSigned: false
}

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setTreasurySendActiveTab: (
      state,
      action: PayloadAction<typeof initialState.treasurySendActiveTab>
    ) => {
      state.treasurySendActiveTab = action.payload
    },
    setTPSValue: (
      state,
      action: PayloadAction<typeof initialState.tpsValue>
    ) => {
      state.tpsValue = action.payload
    },
    changeSignState: (state, action: PayloadAction<boolean | undefined>) => {
      state.isSigned = !!action.payload
    }
  }
})

export const { setTreasurySendActiveTab, setTPSValue, changeSignState } =
  commonSlice.actions

export default commonSlice.reducer
