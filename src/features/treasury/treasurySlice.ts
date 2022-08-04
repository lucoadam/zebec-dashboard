import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { setTreasuryData } from "data/api"
import { FetchTreasuryProps, TreasuryState } from "./treasurySlice.d"

const initialState: TreasuryState = {
  loading: false,
  treasuries: [],
  error: ""
}

interface SaveTreasuryProps {
  data: TreasuryState & {
    wallet: string
  }
  callback: () => void
}

//Generates pending, fulfilled and rejected action types
export const updateTreasury = createAsyncThunk(
  "treasury/",
  async ({ name, address }: FetchTreasuryProps) => {
    await setTreasuryData({ name, address })
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTreasury: any = createAsyncThunk(
  "treasury/fetchTreasury",
  async (wallet: string) => {
    const { data: response } = await axios.get(
      `https://internal-ten-cherry.glitch.me/treasury?wallet=${wallet}`
    )
    return response
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveTreasury: any = createAsyncThunk(
  "treasury/saveTreasury",
  async (data: SaveTreasuryProps, { dispatch }) => {
    const { data: response } = await axios.post(
      `https://internal-ten-cherry.glitch.me/treasury`,
      data.data
    )
    dispatch(fetchTreasury(data.data.wallet))
    data.callback()
    return response
  }
)

const treasurySlice = createSlice({
  name: "treasury",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTreasury.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchTreasury.fulfilled,
      (state, action: PayloadAction<typeof initialState.treasuries>) => {
        state.loading = false
        state.treasuries = action.payload
        state.error = ""
      }
    )
    builder.addCase(fetchTreasury.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    builder.addCase(saveTreasury.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      saveTreasury.fulfilled,
      (state, action: PayloadAction<typeof initialState.treasuries>) => {
        state.loading = false
        state.treasuries = action.payload
        state.error = ""
      }
    )
    builder.addCase(saveTreasury.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default treasurySlice.reducer
