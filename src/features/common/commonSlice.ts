import { createSlice, PayloadAction } from "@reduxjs/toolkit"

//declare types for state
interface CommonState {
  treasurySendActiveTab: number
}

const initialState: CommonState = {
  treasurySendActiveTab: 0
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
    }
  }
})

export const { setTreasurySendActiveTab } = commonSlice.actions

export default commonSlice.reducer
