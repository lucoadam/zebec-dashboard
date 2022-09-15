import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { AppDispatch, RootState } from "app/store"
import { fetchTreasuryPendingTransactions } from "features/treasuryTransactions/treasuryTransactionsSlice"

interface TransferToVaultState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: TransferToVaultState = {
  show: false,
  loading: false,
  error: ""
}

export const transferToVault = createAsyncThunk<
  any,
  any,
  { dispatch: AppDispatch; state: RootState }
>("transferToVault/transferToVault", async (data, { dispatch, getState }) => {
  const { treasury } = getState()
  if (treasury.activeTreasury?.uuid) {
    const uuid = treasury.activeTreasury.uuid
    await api.post(`/treasury/${uuid}/transactions/`, data)
    dispatch(setLoading(false))
    dispatch(fetchTreasuryPendingTransactions({ treasury_uuid: uuid }))
    return null
  }
  return
})

export const transferToVaultModalSlice = createSlice({
  name: "transferToVault",
  initialState,
  reducers: {
    showTransferToVaultModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleTransferToVaultModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    //Transfer to vault
    builder.addCase(transferToVault.pending, (state) => {
      state.loading = true
    })
    builder.addCase(transferToVault.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(transferToVault.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const {
  showTransferToVaultModal,
  toggleTransferToVaultModal,
  setLoading
} = transferToVaultModalSlice.actions

export default transferToVaultModalSlice.reducer
