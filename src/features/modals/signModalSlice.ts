import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { AppDispatch, RootState } from "app/store"
import { constants } from "constants/constants"
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice"
import { fetchTreasuryVaultBalance } from "features/treasuryBalance/treasuryVaultBalanceSlice"
import {
  fetchTreasuryPendingTransactions,
  fetchTreasuryTransactionsById,
  fetchTreasuryVaultContinuousTransactionsById,
  fetchTreasuryVaultInstantTransactionsById,
  fetchTreasuryNftTransactionsById,
  preCancelTreasuryVaultContinuousTransaction,
  updateTreasuryVaultContinuousTransactionsStatus
} from "features/treasuryTransactions/treasuryTransactionsSlice"

//declare types for state
interface SignState {
  transaction: any
  show: boolean
  loading: boolean
  error: string
}

const initialState: SignState = {
  transaction: null,
  show: false,
  loading: false,
  error: ""
}
export const signTransaction = createAsyncThunk<
  any,
  { uuid: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "signTransaction/signTransaction",
  async ({ uuid }, { dispatch, getState }) => {
    const { treasury, signTransaction } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(`/treasury/${treasury_uuid}/transactions/${uuid}/approve/`)
      await dispatch(
        fetchTreasuryPendingTransactions({ treasury_uuid: treasury_uuid })
      )
      await dispatch(
        fetchTreasuryTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      dispatch(toggleSignModal())
      // After last sign fetch balance
      if (
        signTransaction.transaction.approved_by.length + 1 >=
        treasury.activeTreasury.min_confirmations
      ) {
        setTimeout(() => {
          if (treasury.activeTreasury) {
            //Treasury Balance
            dispatch(
              fetchTreasuryBalance({
                name: treasury.activeTreasury.name,
                address: treasury.activeTreasury.treasury_address
              })
            )
            //Treasury Vault Balance
            dispatch(
              fetchTreasuryVaultBalance({
                name: treasury.activeTreasury.name,
                address: treasury.activeTreasury.treasury_vault_address
              })
            )
          }
        }, constants.BALANCE_FETCH_TIMEOUT)
      }
      return
    }
    return
  }
)

export const vaultSignTransaction = createAsyncThunk<
  any,
  { uuid: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "signTransaction/vaultSignTransaction",
  async ({ uuid }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(
        `/treasury/${treasury_uuid}/vault-instant-transactions/${uuid}/approve/`
      )
      await dispatch(
        fetchTreasuryVaultInstantTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      dispatch(toggleSignModal())
      return
    }
    return
  }
)

export const vaultContinuousSignTransaction = createAsyncThunk<
  any,
  { uuid: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "signTransaction/vaultContinuousSignTransaction",
  async ({ uuid }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(
        `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/approve/`
      )
      await dispatch(
        fetchTreasuryVaultContinuousTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      dispatch(toggleSignModal())
      return
    }
    return
  }
)

export const vaultContinuousSignTransactionLatestEvent = createAsyncThunk<
  any,
  { uuid: string; event_id: string; transaction_hash?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "signTransaction/vaultContinuousSignTransactionLatestEvent",
  async ({ uuid, event_id, transaction_hash }, { dispatch, getState }) => {
    const { treasury, signTransaction } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(
        `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/events/${event_id}/approve/`
      )

      if (
        signTransaction.transaction.latest_transaction_event.approved_by
          .length +
          1 >=
        treasury.activeTreasury.min_confirmations
      ) {
        if (transaction_hash) {
          await dispatch(
            updateTreasuryVaultContinuousTransactionsStatus({
              treasury_uuid: treasury_uuid,
              uuid: uuid,
              transaction_hash: transaction_hash
            })
          )
        } else {
          await dispatch(
            preCancelTreasuryVaultContinuousTransaction({
              treasury_uuid: treasury_uuid,
              uuid: uuid
            })
          )
        }
        await dispatch(
          fetchTreasuryVaultContinuousTransactionsById({
            treasury_uuid: treasury_uuid,
            uuid: uuid
          })
        )
      }
      dispatch(toggleSignModal())

      return
    }
    return
  }
)

export const signNftTransaction = createAsyncThunk<
  any,
  { uuid: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "signTransaction/signNftTransaction",
  async ({ uuid }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.get(
        `/treasury/${treasury_uuid}/nft-transactions/${uuid}/approve/`
      )
      await dispatch(
        fetchTreasuryNftTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      dispatch(toggleSignModal())
      return
    }
    return
  }
)

export const signModalSlice = createSlice({
  name: "signTransaction",
  initialState,
  reducers: {
    showSignModal: (state, action) => {
      state.show = true
      state.loading = false
      state.transaction = action.payload
    },
    toggleSignModal: (state) => {
      state.show = !state.show
      state.transaction = state.show ? null : state.transaction
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    // Sign Transaction
    builder.addCase(signTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(signTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    // Instant Sign
    builder.addCase(vaultSignTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(vaultSignTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(vaultSignTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    //Continuous Sign
    builder.addCase(vaultContinuousSignTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(vaultContinuousSignTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(
      vaultContinuousSignTransaction.rejected,
      (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Something went wrong"
      }
    )
    //Continuous Sign Latest event
    builder.addCase(
      vaultContinuousSignTransactionLatestEvent.pending,
      (state) => {
        state.loading = true
      }
    )
    builder.addCase(
      vaultContinuousSignTransactionLatestEvent.fulfilled,
      (state) => {
        state.loading = false
        state.error = ""
      }
    )
    builder.addCase(
      vaultContinuousSignTransactionLatestEvent.rejected,
      (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Something went wrong"
      }
    )
    //NFT Sign
    builder.addCase(signNftTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signNftTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(signNftTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showSignModal, toggleSignModal, setLoading } =
  signModalSlice.actions

export default signModalSlice.reducer
