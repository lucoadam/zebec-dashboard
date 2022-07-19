import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface HarvestState {
  show: boolean
  loading: boolean
  error: string
}

const initialState: HarvestState = {
  show: false,
  loading: false,
  error: ""
}
export const harvestTransaction = createAsyncThunk(
  "harvest/harvestTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const harvestSlice = createSlice({
  name: "harvest",
  initialState,
  reducers: {
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleHarvestModal: (state) => {
      state.show = !state.show
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(harvestTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(harvestTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(harvestTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showModal, toggleHarvestModal, setLoading } =
  harvestSlice.actions

export default harvestSlice.reducer
