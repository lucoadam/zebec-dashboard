import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface UnStakeState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: UnStakeState = {
  show: false,
  loading: false,
  error: ""
}
export const unStakeTransaction = createAsyncThunk(
  "unStake/unStakeTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const unStakeSlice = createSlice({
  name: "unStake",
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
    builder.addCase(unStakeTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(unStakeTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(unStakeTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showModal, toggleUnStakeModal, setLoading } =
  unStakeSlice.actions

export default unStakeSlice.reducer
