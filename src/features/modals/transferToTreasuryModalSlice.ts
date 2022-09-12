import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch } from "app/store"

interface TransferToTreasuryState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: TransferToTreasuryState = {
  show: false,
  loading: false,
  error: ""
}

export const transferToTreasury = createAsyncThunk<
  any,
  any,
  { dispatch: AppDispatch }
>("transferToVault/transferToTreasury", async (data, { dispatch }) => {
  console.log(data)
  // const response = await api.post(`/`, data)
  dispatch(toggleTransferToTreasuryModal())
  return
})

export const transferToTreasuryModalSlice = createSlice({
  name: "transferToTreasury",
  initialState,
  reducers: {
    showTransferToTreasuryModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleTransferToTreasuryModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    //Transfer back to treasury
    builder.addCase(transferToTreasury.pending, (state) => {
      state.loading = true
    })
    builder.addCase(transferToTreasury.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(transferToTreasury.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const {
  showTransferToTreasuryModal,
  toggleTransferToTreasuryModal,
  setLoading
} = transferToTreasuryModalSlice.actions

export default transferToTreasuryModalSlice.reducer
