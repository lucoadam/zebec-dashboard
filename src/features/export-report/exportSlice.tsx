import { createSlice } from "@reduxjs/toolkit"


//declare types for state
interface ExportState {
  exportModal: boolean
}

const initialState: ExportState = {
  exportModal: false
}

export const exportSlice = createSlice({
  name: "ExportSlice",
  initialState,
  reducers: {
    toggleExportModal: (state) => {
      state.exportModal = !state.exportModal
    }
  }
})

export const { toggleExportModal } = exportSlice.actions

export default exportSlice.reducer
