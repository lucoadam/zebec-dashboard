import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface AddressBook {
  name: number
  address: string
}
interface AddressBookState {
  loading: boolean
  saving: boolean
  deleting: boolean
  addressBooks: AddressBook[]
  error: string
}

const initialState: AddressBookState = {
  loading: false,
  saving: false,
  deleting: false,
  addressBooks: [],
  error: ""
}

//Generates pending, fulfilled and rejected action types
export const fetchAddressBook = createAsyncThunk(
  "addressBook/fetchAddressBook",
  async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/addressBook"
    )
    return response.data
  }
)
export const saveAddressBook = createAsyncThunk(
  "addressBook/saveAddressBook",
  async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/addressBook"
    )
    return response.data
  }
)
export const deleteAddressBook = createAsyncThunk(
  "addressBook/deleteAddressBook",
  async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/addressBook"
    )
    return response.data
  }
)

const addressBookSlice = createSlice({
  name: "user",
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
      state.addressBooks = []
      state.error = action.error.message ?? "Something went wrong"
    })
    builder.addCase(saveAddressBook.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      saveAddressBook.fulfilled,
      (state, action: PayloadAction<typeof initialState.addressBooks>) => {
        state.loading = false
        state.addressBooks = action.payload
        state.error = ""
      }
    )
    builder.addCase(saveAddressBook.rejected, (state, action) => {
      state.saving = false
      state.addressBooks = []
      state.error = action.error.message ?? "Something went wrong"
    })
    builder.addCase(deleteAddressBook.pending, (state) => {
      state.deleting = true
    })
    builder.addCase(
      deleteAddressBook.fulfilled,
      (state, action: PayloadAction<typeof initialState.addressBooks>) => {
        state.deleting = false
        state.addressBooks = action.payload
        state.error = ""
      }
    )
    builder.addCase(deleteAddressBook.rejected, (state, action) => {
      state.deleting = false
      state.addressBooks = []
      state.error = action.error.message ?? "Something went wrong"
    })
  }
})

export default addressBookSlice.reducer
