import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface UnstakeState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: UnstakeState = {
  show: false,
  loading: false,
  error: ""
}
export const unstakeTransaction = createAsyncThunk(
  "unstake/unstakeTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const unstakeSlice = createSlice({
  name: "unstake",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleUnStakeModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(unstakeTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(unstakeTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(unstakeTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showModal, toggleUnStakeModal, setLoading } =
  unstakeSlice.actions

export default unstakeSlice.reducer
