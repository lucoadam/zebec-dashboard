import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "api/api"
import { AppDispatch, RootState } from "app/store"

interface TransactionState {
  loading: boolean
  error: string
  pendingTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  transactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  vaultInstantTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  vaultContinuousTransactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
}

const initialState: TransactionState = {
  loading: false,
  error: "",
  pendingTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  },
  transactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  },
  vaultInstantTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  },
  vaultContinuousTransactions: {
    count: null,
    next: "",
    previous: "",
    results: []
  }
}

export const fetchTreasuryPendingTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string },
  {}
>("treasuryTransactions/fetchTransactions", async ({ treasury_uuid }, {}) => {
  const response = await api.get(`/treasury/${treasury_uuid}/transactions/`, {
    params: {
      limit: 6,
      status: "PENDING",
      offset: 0
    }
  })
  return response.data
})

export const fetchTreasuryTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string; status?: "PENDING" | "ACCEPTED" | "REJECTED" },
  {}
>(
  "treasuryTransactions/fetchTreasuryTransactions",
  async ({ treasury_uuid, status }, {}) => {
    const response = await api.get(`/treasury/${treasury_uuid}/transactions/`, {
      params: {
        status: status ? status : ""
      }
    })
    return response.data
  }
)

export const fetchTreasuryVaultInstantTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string; status?: "PENDING" | "ACCEPTED" | "REJECTED" },
  {}
>(
  "treasuryTransactions/fetchTreasuryVaultInstantTransactions",
  async ({ treasury_uuid, status }, {}) => {
    const response = await api.get(
      `/treasury/${treasury_uuid}/vault-instant-transactions/`,
      {
        params: {
          status: status ? status : ""
        }
      }
    )
    return response.data
  }
)

export const fetchTreasuryVaultContinuousTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string; status?: "PENDING" | "ACCEPTED" | "REJECTED" },
  {}
>(
  "treasuryTransactions/fetchTreasuryVaultContinuousTransactions",
  async ({ treasury_uuid, status }, {}) => {
    const response = await api.get(
      `/treasury/${treasury_uuid}/vault-streaming-transactions/`,
      {
        params: {
          status: status ? status : ""
        }
      }
    )
    return response.data
  }
)

export const fetchTreasuryVaultContinuousTransactionsById = createAsyncThunk<
  any,
  {
    treasury_uuid: string
    uuid: string
  },
  {}
>(
  "treasuryTransactions/fetchTreasuryVaultContinuousTransactionsById",
  async ({ treasury_uuid, uuid }, {}) => {
    const response = await api.get(
      `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/`
    )
    return response.data
  }
)

export const saveTreasuryWithdrawDepositTransactions = createAsyncThunk<
  any,
  any,
  { dispatch: AppDispatch; state: RootState }
>(
  "treasuryTransactions/saveTreasuryWithdrawDepositTransactions",
  async (data, { dispatch, getState }) => {
    const { treasury } = getState()
    if (treasury.activeTreasury?.uuid) {
      const uuid = treasury.activeTreasury.uuid
      await api.post(`/treasury/${uuid}/transactions/`, data)
      dispatch(fetchTreasuryPendingTransactions({ treasury_uuid: uuid }))
      return null
    }
    return
  }
)

export const treasuryTransactionsSlice = createSlice({
  name: "treasuryTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Pending Transactions
    builder.addCase(fetchTreasuryPendingTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTreasuryPendingTransactions.fulfilled,
      (state, action) => {
        state.loading = false
        state.error = ""
        state.pendingTransactions = action.payload
      }
    )
    builder.addCase(
      fetchTreasuryPendingTransactions.rejected,
      (state, action) => {
        state.loading = false
        state.error = action?.error?.message ?? "Something went wrong"
      }
    )
    //Treasury Transactions
    builder.addCase(fetchTreasuryTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchTreasuryTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
      state.transactions = action.payload
    })
    builder.addCase(fetchTreasuryTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    //Save Treasury Withdraw Deposit Transactions
    builder.addCase(
      saveTreasuryWithdrawDepositTransactions.pending,
      (state) => {
        state.loading = true
      }
    )
    builder.addCase(
      saveTreasuryWithdrawDepositTransactions.fulfilled,
      (state) => {
        state.loading = false
        state.error = ""
      }
    )
    builder.addCase(
      saveTreasuryWithdrawDepositTransactions.rejected,
      (state, action) => {
        state.loading = false
        state.error = action.error.message ?? "Something went wrong"
      }
    )
    //Treasury Vault Instant Transactions
    builder.addCase(fetchTreasuryVaultInstantTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTreasuryVaultInstantTransactions.fulfilled,
      (state, action) => {
        state.loading = false
        state.error = ""
        state.vaultInstantTransactions = action.payload
      }
    )
    builder.addCase(
      fetchTreasuryVaultInstantTransactions.rejected,
      (state, action) => {
        state.loading = false
        state.error = action?.error?.message ?? "Something went wrong"
      }
    )
    //Treasury Vault Continuous Transactions
    builder.addCase(
      fetchTreasuryVaultContinuousTransactions.pending,
      (state) => {
        state.loading = true
      }
    )
    builder.addCase(
      fetchTreasuryVaultContinuousTransactions.fulfilled,
      (state, action) => {
        state.loading = false
        state.error = ""
        state.vaultContinuousTransactions = action.payload
      }
    )
    builder.addCase(
      fetchTreasuryVaultContinuousTransactions.rejected,
      (state, action) => {
        state.loading = false
        state.error = action?.error?.message ?? "Something went wrong"
      }
    )
    //Treasury Vault Continuous Transactions By Id
    builder.addCase(
      fetchTreasuryVaultContinuousTransactionsById.pending,
      (state) => {
        state.loading = true
      }
    )
    builder.addCase(
      fetchTreasuryVaultContinuousTransactionsById.fulfilled,
      (state, action) => {
        const newVaultContinuousTransactions =
          state.vaultContinuousTransactions.results.map((item) => {
            if (item.id === action.payload.id) {
              return action.payload
            }
            return item
          })
        state.loading = false
        state.error = ""
        state.vaultContinuousTransactions.results =
          newVaultContinuousTransactions
      }
    )
    builder.addCase(
      fetchTreasuryVaultContinuousTransactionsById.rejected,
      (state, action) => {
        state.loading = false
        state.error = action?.error?.message ?? "Something went wrong"
      }
    )
  }
})

export default treasuryTransactionsSlice.reducer
