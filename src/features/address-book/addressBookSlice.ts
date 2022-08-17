/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import { RootState } from "app/store"

export interface AddressBook {
  id: number
  name: string
  address: string
}

interface AddressBookState {
  loading: boolean
  saving: boolean
  deleting: boolean
  total: number
  currentPage: number
  limit: number
  addressBooks: AddressBook[]
  error: string
}

interface DeleteProps {
  id: number
}

const initialState: AddressBookState = {
  loading: false,
  saving: false,
  deleting: false,
  total: 0,
  limit: 10,
  currentPage: 1,
  addressBooks: [],
  error: ""
}

export const fetchAddressBook: any = createAsyncThunk(
  "addressBook/fetchAddressBook",
  async (_, { getState }) => {
    const { address } = getState() as RootState
    const { data: response } = await api.get(
      `/user/address/?limit=${address.limit}&offset=${
        (address.currentPage - 1) * address.limit
      }`
    )
    return {
      addressBooks: response.results,
      total: response.count
    }
  }
)

export const saveAddressBook: any = createAsyncThunk(
  "addressBook/saveAddressBook",
  async (
    addressBookData: {
      data: {
        name: string
        wallet: string
      }
      callback: (error?: unknown) => void
    },
    { dispatch }
  ) => {
    try {
      const { data: response } = await api.post(
        "/user/address/",
        addressBookData.data
      )
      dispatch(fetchAddressBook())
      addressBookData?.callback()
      return response
    } catch (error) {
      addressBookData?.callback(error)
      throw error
    }
  }
)

export const updateAddressBook: any = createAsyncThunk(
  "addressBook/updateAddressBook",
  async (
    addressBookData: {
      data: {
        id: number
        name: string
        wallet: string
      }
      callback: (error?: unknown) => void
    },
    { dispatch }
  ) => {
    try {
      const { data: response } = await api.put(
        `/user/address/${addressBookData.data.id}/`,
        addressBookData.data
      )
      dispatch(fetchAddressBook())
      addressBookData?.callback()
      return response
    } catch (error) {
      addressBookData?.callback(error)
      throw error
    }
  }
)
export const deleteAddressBook: any = createAsyncThunk(
  "addressBook/deleteAddressBook",
  async (
    data: DeleteProps & {
      callback: (error?: unknown) => void
    },
    { dispatch }
  ) => {
    try {
      const { data: response } = await api.delete(`/user/address/${data.id}`)
      dispatch(fetchAddressBook())
      data?.callback()
      return response
    } catch (error) {
      data?.callback(error)
      throw error
    }
  }
)

//Generates pending, fulfilled and rejected action types
const addressBookSlice = createSlice({
  name: "addressBook",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAddressBook.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchAddressBook.fulfilled,
      (state, action: PayloadAction<AddressBookState>) => {
        state.loading = false
        state.addressBooks = action.payload.addressBooks
        state.total = action.payload.total
        state.error = ""
      }
    )
    builder.addCase(fetchAddressBook.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    builder.addCase(saveAddressBook.pending, (state) => {
      state.saving = true
    })
    builder.addCase(saveAddressBook.fulfilled, (state) => {
      state.saving = false
      state.error = ""
    })
    builder.addCase(saveAddressBook.rejected, (state, action) => {
      state.saving = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    builder.addCase(updateAddressBook.pending, (state) => {
      state.saving = true
    })
    builder.addCase(updateAddressBook.fulfilled, (state) => {
      state.saving = false
      state.error = ""
    })
    builder.addCase(updateAddressBook.rejected, (state, action) => {
      state.saving = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    builder.addCase(deleteAddressBook.pending, (state) => {
      state.deleting = true
    })
    builder.addCase(deleteAddressBook.fulfilled, (state) => {
      state.deleting = false
      state.error = ""
    })
    builder.addCase(deleteAddressBook.rejected, (state, action) => {
      state.deleting = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
  }
})

export const { setCurrentPage, setLimit } = addressBookSlice.actions

export default addressBookSlice.reducer
