import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AppDispatch } from "app/store"

interface WithdrawFromTreasuryState {
  loading: boolean
  error: string
}

const initialState: WithdrawFromTreasuryState = {
  loading: false,
  error: ""
}

export const withdrawFromTreasuryToWallet = createAsyncThunk<
  any,
  any,
  { dispatch: AppDispatch }
>(
  "withdrawFromTreasury/withdrawFromTreasuryToWallet",
  async (data, { dispatch }) => {
    console.log(data)
    // const response = await api.post(`/`, data)
    return
  }
)

export const withdraeFromTreasurySlice = createSlice({
  name: "withdrawFromTreasury",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //withdraw from treasury
    builder.addCase(withdrawFromTreasuryToWallet.pending, (state) => {
      state.loading = true
    })
    builder.addCase(withdrawFromTreasuryToWallet.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(withdrawFromTreasuryToWallet.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default withdraeFromTreasurySlice.reducer
