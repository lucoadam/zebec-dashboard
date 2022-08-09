import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

//declare types for state
interface SignState {
  show: boolean
  loading: boolean
  error: string
  isSigned: boolean
}

const initialState: SignState = {
  show: false,
  loading: false,
  error: "",
  isSigned: false
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
    showModal: (state) => {
      state.show = true
      state.loading = false
    },
    toggleSignModal: (state) => {
      state.show = !state.show
    },
    changeSignState: (state, action: PayloadAction<boolean | undefined>) => {
      state.isSigned = !!action.payload
    },
    setLoading: (state, action: PayloadAction<typeof initialState.loading>) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signTransaction.pending, (state) => {
      state.loading = true
      state.isSigned = false
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(signTransaction.fulfilled, (state, action) => {
      state.loading = false
      state.isSigned = true
      state.error = ""
    })
    builder.addCase(signTransaction.rejected, (state, action) => {
      state.loading = false
      state.isSigned = false

      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export const { showModal, toggleSignModal, setLoading, changeSignState } =
  signModalSlice.actions

export default signModalSlice.reducer
