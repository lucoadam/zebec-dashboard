import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { AppDispatch, RootState } from "app/store"
import {
  fetchTreasuryPendingTransactions,
  fetchTreasuryTransactionsById,
  fetchTreasuryVaultContinuousTransactionsById,
  fetchTreasuryVaultInstantTransactionsById
} from "features/treasuryTransactions/treasuryTransactionsSlice"

//declare types for state
interface RejectState {
  transaction: any
  show: boolean
  loading: boolean
  error: string
}

const initialState: RejectState = {
  transaction: null,
  show: false,
  loading: false,
  error: ""
}

export const rejectTransaction = createAsyncThunk<
  any,
  { uuid: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "rejectTransaction/rejectTransaction",
  async ({ uuid }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(`/treasury/${treasury_uuid}/transactions/${uuid}/reject/`)
      dispatch(
        fetchTreasuryPendingTransactions({ treasury_uuid: treasury_uuid })
      )
      dispatch(
        fetchTreasuryTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      dispatch(toggleRejectModal())
      return
    }
    return
  }
)

export const vaultRejectTransaction = createAsyncThunk<
  any,
  { uuid: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "rejectTransaction/vaultRejectTransaction",
  async ({ uuid }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(
        `/treasury/${treasury_uuid}/vault-instant-transactions/${uuid}/reject/`
      )
      dispatch(
        fetchTreasuryVaultInstantTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      dispatch(toggleRejectModal())
      return
    }
    return
  }
)

export const vaultContinuousRejectTransaction = createAsyncThunk<
  any,
  { uuid: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "rejectTransaction/vaultContinuousRejectTransaction",
  async ({ uuid }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(
        `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/reject/`
      )
      dispatch(
        fetchTreasuryVaultContinuousTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      dispatch(toggleRejectModal())
      return
    }
    return
  }
)

export const vaultContinuousRejectTransactionLatestEvent = createAsyncThunk<
  any,
  { uuid: string; event_id: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "rejectTransaction/vaultContinuousRejectTransactionLatestEvent",
  async ({ uuid, event_id }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(
        `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/events/${event_id}/reject/`
      )
      dispatch(
        fetchTreasuryVaultContinuousTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      dispatch(toggleRejectModal())
      return
    }
    return
  }
)

export const rejectModalSlice = createSlice({
  name: "rejectTransaction",
  initialState,
  reducers: {
    showRejectModal: (
      state,
      action: PayloadAction<typeof initialState.transaction>
    ) => {
      state.show = true
      state.loading = false
      state.transaction = action.payload
    },
    toggleRejectModal: (state) => {
      state.show = !state.show
      state.transaction = state.show ? null : state.transaction
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    //Reject
    builder.addCase(rejectTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(rejectTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(rejectTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    //Reject Instant
    builder.addCase(vaultRejectTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(vaultRejectTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(vaultRejectTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    //Reject Continuous
    builder.addCase(vaultContinuousRejectTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(vaultContinuousRejectTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(
      vaultContinuousRejectTransaction.rejected,
      (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Something went wrong"
      }
    )
    //Reject Transaction Latest Event
    builder.addCase(
      vaultContinuousRejectTransactionLatestEvent.pending,
      (state) => {
        state.loading = true
      }
    )
    builder.addCase(
      vaultContinuousRejectTransactionLatestEvent.fulfilled,
      (state) => {
        state.loading = false
        state.error = ""
      }
    )
    builder.addCase(
      vaultContinuousRejectTransactionLatestEvent.rejected,
      (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Something went wrong"
      }
    )
  }
})

export const { showRejectModal, toggleRejectModal, setLoading } =
  rejectModalSlice.actions

export default rejectModalSlice.reducer
