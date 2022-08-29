import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { fetchTransactionsById } from "api"
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
export const pauseTransaction = createAsyncThunk(
  "pause/pauseTransaction",
  async (uuid: string, { dispatch }) => {
    const response = await api.patch(`/transaction/${uuid}/`, {
      status: "paused"
    })

    dispatch(fetchTransactionsById(uuid))

    return response.data
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
    builder.addCase(pauseTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(pauseTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(pauseTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showPauseModal, togglePauseModal, setLoading } =
  pauseModalSlice.actions

export default pauseModalSlice.reducer
