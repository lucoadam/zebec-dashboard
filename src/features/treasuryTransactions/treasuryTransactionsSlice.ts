/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { AppDispatch, RootState } from "app/store"
import { PaginationInterface } from "components/shared"

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
  initiatedTransactions: string[]
  pagination: PaginationInterface
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
  },
  initiatedTransactions: [],
  pagination: {
    currentPage: 1,
    limit: 10,
    total: 0
  }
}

// Fetch Pending
export const fetchTreasuryPendingTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string },
  {}
>("treasuryTransactions/fetchTransactions", async ({ treasury_uuid }, {}) => {
  const response = await api.get(`/treasury/${treasury_uuid}/transactions/`, {
    params: {
      limit: 6,
      approval_status_fn: "PENDING",
      offset: 0
    }
  })
  return response.data
})

// Fetch Transactions
export const fetchTreasuryTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string; status?: "PENDING" | "ACCEPTED" | "REJECTED" },
  {}
>(
  "treasuryTransactions/fetchTreasuryTransactions",
  async ({ treasury_uuid, status }, { getState }) => {
    const { treasuryTransactions } = getState() as RootState
    const response = await api.get(`/treasury/${treasury_uuid}/transactions/`, {
      params: {
        approval_status_fn: status ? status : "",
        limit: treasuryTransactions.pagination.limit,
        offset:
          (Number(treasuryTransactions.pagination.currentPage) - 1) *
          treasuryTransactions.pagination.limit
      }
    })
    return response.data
  }
)

//Fetch Transactions By Id
export const fetchTreasuryTransactionsById = createAsyncThunk<
  any,
  {
    treasury_uuid: string
    uuid: string
  },
  {}
>(
  "treasuryTransactions/fetchTreasuryTransactionsById",
  async ({ treasury_uuid, uuid }, {}) => {
    const response = await api.get(
      `/treasury/${treasury_uuid}/transactions/${uuid}/`
    )
    return response.data
  }
)

// Fetch Instant
export const fetchTreasuryVaultInstantTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string; status?: "PENDING" | "ACCEPTED" | "REJECTED" },
  {}
>(
  "treasuryTransactions/fetchTreasuryVaultInstantTransactions",
  async ({ treasury_uuid, status }, { getState }) => {
    const { treasuryTransactions } = getState() as RootState
    const response: any = await api.get(
      `/treasury/${treasury_uuid}/vault-instant-transactions/`,
      {
        params: {
          approval_status_fn: status ? status : "",
          limit: treasuryTransactions.pagination.limit,
          offset:
            (Number(treasuryTransactions.pagination.currentPage) - 1) *
            treasuryTransactions.pagination.limit
        }
      }
    )
    return response.data
  }
)

//Fetch Instant By Id
export const fetchTreasuryVaultInstantTransactionsById = createAsyncThunk<
  any,
  {
    treasury_uuid: string
    uuid: string
  },
  {}
>(
  "treasuryTransactions/fetchTreasuryVaultInstantTransactionsById",
  async ({ treasury_uuid, uuid }, {}) => {
    const response = await api.get(
      `/treasury/${treasury_uuid}/vault-instant-transactions/${uuid}/`
    )
    return response.data
  }
)

//Fetch Continuous
export const fetchTreasuryVaultContinuousTransactions = createAsyncThunk<
  any,
  { treasury_uuid: string; status?: "PENDING" | "ACCEPTED" | "REJECTED" },
  {}
>(
  "treasuryTransactions/fetchTreasuryVaultContinuousTransactions",
  async ({ treasury_uuid, status }, { getState }) => {
    const { treasuryTransactions } = getState() as RootState
    const response = await api.get(
      `/treasury/${treasury_uuid}/vault-streaming-transactions/`,
      {
        params: {
          status: status ? status : "",
          limit: treasuryTransactions.pagination.limit,
          offset:
            (Number(treasuryTransactions.pagination.currentPage) - 1) *
            treasuryTransactions.pagination.limit
        }
      }
    )
    return response.data
  }
)

//Fetch Continuous By Id
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

// Update Continuous By Status
export const updateTreasuryVaultContinuousTransactionsStatus = createAsyncThunk<
  any,
  {
    treasury_uuid: string
    uuid: string
    transaction_hash: string
  },
  {}
>(
  "treasuryTransactions/updateTreasuryVaultContinuousTransactionsStatus",
  async ({ treasury_uuid, uuid, transaction_hash }, {}) => {
    await api.post(
      `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/update-status/`,
      {
        transaction_hash: transaction_hash,
        completed: true
      }
    )
    return
  }
)

//Save Treasury Withdraw Deposit
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

// Pre Cancel Treasury Vault Continuous Transactions
export const preCancelTreasuryVaultContinuousTransaction = createAsyncThunk<
  any,
  {
    treasury_uuid: string
    uuid: string
  },
  {}
>(
  "treasuryTransactions/preCancelTreasuryVaultContinuousTransaction",
  async ({ treasury_uuid, uuid }, {}) => {
    await api.post(
      `/treasury/${treasury_uuid}/vault-streaming-transactions/${uuid}/pre-cancel/`
    )
    return
  }
)

export const treasuryTransactionsSlice = createSlice({
  name: "treasuryTransactions",
  initialState,
  reducers: {
    setTreasuryTransactionPagination: (
      state,
      action: PayloadAction<PaginationInterface>
    ) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      }
    },
    setInitiatedTreasuryTransactions: (
      state,
      action: PayloadAction<string>
    ) => {
      state.initiatedTransactions = [
        ...state.initiatedTransactions,
        action.payload
      ]
    },
    removeInitiatedTreasuryTransactions: (
      state,
      action: PayloadAction<string>
    ) => {
      state.initiatedTransactions = state.initiatedTransactions.filter(
        (initiatedTrx) => initiatedTrx !== action.payload
      )
    }
  },
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
      state.pagination.total = action.payload.count
    })
    builder.addCase(fetchTreasuryTransactions.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    //Treasury Transactions By Id
    builder.addCase(fetchTreasuryTransactionsById.pending, () => {
      // state.loading = true
    })
    builder.addCase(
      fetchTreasuryTransactionsById.fulfilled,
      (state, action) => {
        const newTransactions = state.transactions.results.map((item) => {
          if (item.id === action.payload.id) {
            return action.payload
          }
          return item
        })
        // state.loading = false
        state.error = ""
        state.transactions.results = newTransactions
      }
    )
    builder.addCase(fetchTreasuryTransactionsById.rejected, (state, action) => {
      // state.loading = false
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
        state.pagination.total = action.payload.count
      }
    )
    builder.addCase(
      fetchTreasuryVaultInstantTransactions.rejected,
      (state, action) => {
        state.loading = false
        state.error = action?.error?.message ?? "Something went wrong"
      }
    )
    //Treasury Vault Instant Transactions By Id
    builder.addCase(fetchTreasuryVaultInstantTransactionsById.pending, () => {
      // state.loading = true
    })
    builder.addCase(
      fetchTreasuryVaultInstantTransactionsById.fulfilled,
      (state, action) => {
        const newVaultInstantTransactions =
          state.vaultInstantTransactions.results.map((item) => {
            if (item.id === action.payload.id) {
              return action.payload
            }
            return item
          })
        // state.loading = false
        state.error = ""
        state.vaultInstantTransactions.results = newVaultInstantTransactions
      }
    )
    builder.addCase(
      fetchTreasuryVaultInstantTransactionsById.rejected,
      (state, action) => {
        // state.loading = false
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
        state.pagination.total = action.payload.count
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
      () => {
        // state.loading = true
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
        // state.loading = false
        state.error = ""
        state.vaultContinuousTransactions.results =
          newVaultContinuousTransactions
      }
    )
    builder.addCase(
      fetchTreasuryVaultContinuousTransactionsById.rejected,
      (state, action) => {
        // state.loading = false
        state.error = action?.error?.message ?? "Something went wrong"
      }
    )
    //Treasury Vault Update Continuous Transactions Status
    builder.addCase(
      updateTreasuryVaultContinuousTransactionsStatus.pending,
      () => {
        // state.loading = true
      }
    )
    builder.addCase(
      updateTreasuryVaultContinuousTransactionsStatus.fulfilled,
      (state) => {
        // state.loading = false
        state.error = ""
      }
    )
    builder.addCase(
      updateTreasuryVaultContinuousTransactionsStatus.rejected,
      (state, action) => {
        // state.loading = false
        state.error = action?.error?.message ?? "Something went wrong"
      }
    )
  }
})

export const {
  setInitiatedTreasuryTransactions,
  removeInitiatedTreasuryTransactions,
  setTreasuryTransactionPagination
} = treasuryTransactionsSlice.actions

export default treasuryTransactionsSlice.reducer
