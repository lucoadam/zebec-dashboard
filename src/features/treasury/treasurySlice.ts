/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import {
  UpdateTreasuryProps,
  UpdateTreasuryResponse,
  TreasuryState,
  CreateTreasuryProps
} from "./treasurySlice.d"
import { toast } from "features/toasts/toastsSlice"
import { AppDispatch } from "app/store"

const initialState: TreasuryState = {
  loading: false,
  treasuries: {
    count: null,
    next: null,
    previous: null,
    results: []
  },
  error: "",
  activeTreasury: null,
  updating: false,
  updatingError: "",
  archiving: false,
  archiveError: "",
  treasuryOverallActivity: {},
  treasuryWeeklyActivity: {}
}

export const fetchTreasury = createAsyncThunk(
  "treasury/fetchTreasury",
  async () => {
    const { data: response } = await api.get(`/treasury/`)
    return response
  }
)

export const createTreasury = createAsyncThunk<
  any,
  CreateTreasuryProps,
  {
    dispatch: AppDispatch
  }
>("treasury/createTreasury", async (data, { dispatch }) => {
  const { data: response } = await api.post(`/treasury/`, data.data)
  await dispatch(fetchTreasury())
  data.callback()
  return response
})

export const updateTreasury = createAsyncThunk<
  UpdateTreasuryResponse,
  UpdateTreasuryProps,
  { dispatch: AppDispatch }
>("treasury/updateTreasury", async (data, { dispatch }) => {
  const response = await api.patch(`/treasury/${data.uuid}/`, data)
  if (data.name) {
    dispatch(
      toast.success({
        message: "Treasury name updated successfully."
      })
    )
  } else {
    dispatch(
      toast.success({
        message: "Treasury unarchived successfully."
      })
    )
    dispatch(fetchTreasury())
    data.callback && data.callback()
  }

  return { data: response.data, uuid: data.uuid }
})

export const archiveTreasury = createAsyncThunk<
  null,
  { uuid: string; callback: () => void },
  { dispatch: AppDispatch }
>("treasury/archiveTreasury", async (data, { dispatch }) => {
  await api.delete(`/treasury/${data.uuid}/`)
  dispatch(
    toast.success({
      message: "Treasury archived successfully."
    })
  )
  dispatch(fetchTreasury())
  data.callback()
  return null
})

//Overall Activity
export const fetchTreasuryOverallActivity = createAsyncThunk<
  any,
  { uuid: string },
  {}
>("treasury/fetchTreasuryOverallActivity", async (data, {}) => {
  const response = await api.get(`/treasury/${data.uuid}/total/`)
  console.log(response)
  return response.data
})

//Weekly Activity
export const fetchTreasuryWeeklyActivity = createAsyncThunk<
  any,
  { uuid: string },
  {}
>("treasury/fetchTreasuryWeeklyActivity", async (data, {}) => {
  const response = await api.get(`/treasury/${data.uuid}/weekly/`)
  console.log(response)
  return response.data
})

const treasurySlice = createSlice({
  name: "treasury",
  initialState,
  reducers: {
    setActiveTreasury: (state, action: PayloadAction<string>) => {
      state.activeTreasury =
        state.treasuries.results.find(
          (treasury) => treasury.uuid === action.payload
        ) || null
    }
  },
  extraReducers: (builder) => {
    //Fetch Treasury
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
    //Create Treasury
    builder.addCase(createTreasury.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createTreasury.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(createTreasury.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    // Update Treasury
    builder.addCase(updateTreasury.pending, (state) => {
      state.updating = true
    })
    builder.addCase(updateTreasury.fulfilled, (state, action) => {
      const updatedTreasuries = state.treasuries.results.map((treasury) =>
        treasury.uuid === action.payload.uuid
          ? { ...treasury, ...action.payload.data }
          : treasury
      )
      state.updating = false
      state.treasuries.results = updatedTreasuries
      state.updatingError = ""
    })
    builder.addCase(updateTreasury.rejected, (state, action) => {
      state.updating = false
      state.updatingError = action.error.message ?? "Something went wrong"
    })
    // Archive Treasury
    builder.addCase(archiveTreasury.pending, (state) => {
      state.archiving = true
    })
    builder.addCase(archiveTreasury.fulfilled, (state) => {
      state.archiving = false
      state.archiveError = ""
    })
    builder.addCase(archiveTreasury.rejected, (state, action) => {
      state.archiving = false
      state.archiveError = action.error.message ?? "Something went wrong"
    })
    //Overall Activity
    builder.addCase(fetchTreasuryOverallActivity.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchTreasuryOverallActivity.fulfilled, (state, action) => {
      state.loading = false
      state.treasuryOverallActivity = action.payload
    })
    builder.addCase(fetchTreasuryOverallActivity.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
    //Weekly Activity
    builder.addCase(fetchTreasuryWeeklyActivity.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchTreasuryWeeklyActivity.fulfilled, (state, action) => {
      state.loading = false
      state.treasuryWeeklyActivity = action.payload
    })
    builder.addCase(fetchTreasuryWeeklyActivity.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default treasurySlice.reducer
export const { setActiveTreasury } = treasurySlice.actions
