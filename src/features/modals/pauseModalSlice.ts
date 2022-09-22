import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { fetchTransactionsById } from "api"
import { AppDispatch, RootState } from "app/store"
import { fetchTreasuryVaultContinuousTransactionsById } from "features/treasuryTransactions/treasuryTransactionsSlice"
//declare types for state
interface PauseState {
  transaction: any
  show: boolean
  loading: boolean
  error: string
}

const initialState: PauseState = {
  transaction: null,
  show: false,
  loading: false,
  error: ""
}

export const pauseTransaction = createAsyncThunk<
  any,
  string,
  { dispatch: AppDispatch }
>("pause/pauseTransaction", async (uuid, { dispatch }) => {
  await api.patch(`/transaction/${uuid}/`, {
    status: "paused"
  })
  dispatch(fetchTransactionsById(uuid, "pause"))
  return
})

export const pauseTreasuryTransaction = createAsyncThunk<
  any,
  { uuid: string; transaction_account: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "pause/pauseTreasuryTransaction",
  async ({ uuid, transaction_account }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.patch(
        `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/`,
        {
          status: "paused",
          transaction_account: transaction_account
        }
      )
      dispatch(
        fetchTreasuryVaultContinuousTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
      return
    }
    return
  }
)

export const pauseModalSlice = createSlice({
  name: "pause",
  initialState,
  reducers: {
    showPauseModal: (
      state,
      action: PayloadAction<typeof initialState.transaction>
    ) => {
      state.show = true
      state.loading = false
      state.transaction = action.payload
    },
    togglePauseModal: (state) => {
      state.show = !state.show
      state.transaction = state.show ? null : state.transaction
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    // Pause normal transactions
    builder.addCase(pauseTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(pauseTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(pauseTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    //Pause treasury transactions
    builder.addCase(pauseTreasuryTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(pauseTreasuryTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(pauseTreasuryTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showPauseModal, togglePauseModal, setLoading } =
  pauseModalSlice.actions

export default pauseModalSlice.reducer
