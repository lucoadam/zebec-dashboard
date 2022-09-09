import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

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
export const signTransaction = createAsyncThunk(
  "sign/signTransaction",
  async () => {
    const response = await axios.get("url")
    return response.data
  }
)

export const signModalSlice = createSlice({
  name: "signTransaction",
  initialState,
  reducers: {
    showSignModal: (
      state,
      action: PayloadAction<typeof initialState.transaction>
    ) => {
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
    builder.addCase(signTransaction.pending, (state) => {
      state.loading = true
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(signTransaction.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(signTransaction.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showSignModal, toggleSignModal, setLoading } =
  signModalSlice.actions

export default signModalSlice.reducer
