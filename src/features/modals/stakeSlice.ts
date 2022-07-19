import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface StakeState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: StakeState = {
  show: false,
  loading: false,
  error: ""
}
export const StakeTransaction = createAsyncThunk(
  "Stake/StakeTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const StakeSlice = createSlice({
  name: "Stake",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleStakeModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(StakeTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(StakeTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(StakeTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showModal, toggleStakeModal, setLoading } = StakeSlice.actions

export default StakeSlice.reducer
