import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface WidthState {
  width: number
}

const initialState: WidthState = {
  width: 0
}

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    updateWidth: (state, action: PayloadAction<typeof initialState.width>) => {
      state.width = action.payload
    }
  }
})

export const { updateWidth } = layoutSlice.actions

export default layoutSlice.reducer
