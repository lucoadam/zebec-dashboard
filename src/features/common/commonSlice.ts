import { createSlice, PayloadAction } from "@reduxjs/toolkit"

//declare types for state
interface CommonState {
  treasurySendActiveTab: number
  tpsValue: number
}

const initialState: CommonState = {
  treasurySendActiveTab: 0,
  tpsValue: 0
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
    }
  }
})

export const { setTreasurySendActiveTab, setTPSValue } = commonSlice.actions

export default commonSlice.reducer
