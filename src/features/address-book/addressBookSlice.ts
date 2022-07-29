/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

export interface AddressBook {
  id: number
  name: string
  wallet: string
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
  user: string
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
  async (user: string) => {
    const { data: response } = await axios.get(
      `https://internal-ten-cherry.glitch.me/addressbooks?user=${user}`
    )
    return response
  }
)

export const saveAddressBook: any = createAsyncThunk(
  "addressBook/saveAddressBook",
  async (
    data: AddressBook & {
      user: string
    },
    { dispatch }
  ) => {
    const { data: response } = await axios.post(
      "https://internal-ten-cherry.glitch.me/addressbooks",
      data
    )
    dispatch(fetchAddressBook(data.user))
    return response
  }
)

export const deleteAddressBook: any = createAsyncThunk(
  "addressBook/deleteAddressBook",
  async (data: DeleteProps, { dispatch }) => {
    const { data: response } = await axios.delete(
      `https://internal-ten-cherry.glitch.me/addressbooks/${data.id}`
    )
    dispatch(fetchAddressBook(data.user))
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
