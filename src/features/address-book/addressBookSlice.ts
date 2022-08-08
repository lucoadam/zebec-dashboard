/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api from "api/api"
import axios from "axios"

export interface AddressBook {
  id: number
  name: string
  address: string
}

interface AddressBookState {
  loading: boolean
  saving: boolean
  deleting: boolean
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
  addressBooks: [],
  error: ""
}

export const fetchAddressBook: any = createAsyncThunk(
  "addressBook/fetchAddressBook",
  async () => {
    const { data: response } = await api.get(`/user/address/`)
    return response.results
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
      callback: () => void
    },
    { dispatch }
  ) => {
    const { data: response } = await api.post(
      "/user/address/",
      addressBookData.data
    )
    dispatch(fetchAddressBook())
    addressBookData?.callback()
    return response
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
      callback: () => void
    },
    { dispatch }
  ) => {
    const { data: response } = await api.put(
      `/user/address/${addressBookData.data.id}/`,
      addressBookData.data
    )
    dispatch(fetchAddressBook())
    addressBookData?.callback()
    return response
  }
)
export const deleteAddressBook: any = createAsyncThunk(
  "addressBook/deleteAddressBook",
  async (data: DeleteProps, { dispatch }) => {
    const { data: response } = await api.delete(`/user/address/${data.id}`)
    dispatch(fetchAddressBook())
    return response
  }
)

//Generates pending, fulfilled and rejected action types
const addressBookSlice = createSlice({
  name: "addressBook",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAddressBook.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchAddressBook.fulfilled,
      (state, action: PayloadAction<typeof initialState.addressBooks>) => {
        state.loading = false
        state.addressBooks = action.payload
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

export default addressBookSlice.reducer
