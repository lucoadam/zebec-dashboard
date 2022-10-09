import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { fetchTransactionsById } from "api"
import api from "api/api"
import { AppDispatch, RootState } from "app/store"
import { fetchTreasuryVaultContinuousTransactionsById } from "features/treasuryTransactions/treasuryTransactionsSlice"

//declare types for state
interface ResumeState {
  transaction: any
  show: boolean
  loading: boolean
  error: string
}

const initialState: ResumeState = {
  transaction: null,
  show: false,
  loading: false,
  error: ""
}
export const resumeTransaction = createAsyncThunk(
  "resume/resumeTransaction",
  async (uuid: string, { dispatch }) => {
    const response = await api.patch(`/transaction/${uuid}/`, {
      status: "ready"
    })
    dispatch(toggleResumeModal())
    dispatch(fetchTransactionsById(uuid, "resume"))
    return response.data
  }
)

export const resumeTreasuryTransaction = createAsyncThunk<
  any,
  { uuid: string; transaction_account: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "resume/resumeTreasuryTransaction",
  async ({ uuid, transaction_account }, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const treasury_uuid = treasury.activeTreasury.uuid
      await api.patch(
        `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/`,
        {
          status: "ready",
          transaction_account: transaction_account
        }
      )
      dispatch(toggleResumeModal())
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

export const resumeModalSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    showResumeModal: (
      state,
      action: PayloadAction<typeof initialState.transaction>
    ) => {
      state.show = true
      state.loading = false
      state.transaction = action.payload
    },
    toggleResumeModal: (state) => {
      state.show = !state.show
      state.transaction = state.show ? null : state.transaction
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resumeTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(resumeTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(resumeTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    //Resume Treasury Transactions
    builder.addCase(resumeTreasuryTransaction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(resumeTreasuryTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(resumeTreasuryTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showResumeModal, toggleResumeModal, setLoading } =
  resumeModalSlice.actions

export default resumeModalSlice.reducer
