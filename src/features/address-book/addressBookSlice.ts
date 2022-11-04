/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import api, { CancelRequestAxios } from "api/api"
import { RootState } from "app/store"
import { PaginationInterface } from "components/shared"

export interface AddressBook {
  id: number
  name: string
  address: string
}

interface AddressBookState {
  loading: boolean
  saving: boolean
  deleting: boolean
  pagination: PaginationInterface
  filteredPagination: PaginationInterface
  addressBooks: AddressBook[]
  filteredAddressBooks: AddressBook[]
  error: string
  append?: boolean
}

interface DeleteProps {
  id: number
}

const initialState: AddressBookState = {
  loading: false,
  saving: false,
  deleting: false,
  pagination: {
    total: 0,
    currentPage: 1,
    limit: 10
  },
  filteredPagination: {
    total: 0,
    currentPage: 1,
    limit: 10
  },
  addressBooks: [],
  filteredAddressBooks: [],
  error: ""
}

export const fetchAddressBook: any = createAsyncThunk(
  "addressBook/fetchAddressBook",
  async (_, { getState }) => {
    const { address } = getState() as RootState
    const { data: response } = await api.get(
      `/user/address/?limit=${address.pagination.limit}&offset=${
        (Number(address.pagination.currentPage) - 1) * address.pagination.limit
      }`
    )
    return {
      addressBooks: response.results,
      pagination: {
        ...address.pagination,
        total: response.count
      }
    }
  }
)

const cancelFetchRequest = new CancelRequestAxios()

export const fetchFilteredAddressBook: any = createAsyncThunk(
  "addressBook/fetchFilteredAddressBook",
  async (
    {
      search,
      page,
      append
    }: {
      search: string
      page: number
      append: boolean
    },
    { getState }
  ) => {
    const { address } = getState() as RootState
    if (
      address.filteredAddressBooks.length ===
        address.filteredPagination.total &&
      address.filteredAddressBooks.length > 0
    ) {
      return {
        addressBooks: address.filteredAddressBooks,
        pagination: address.filteredPagination
      }
    }
    cancelFetchRequest.cancelAndCreateToken()

    const { data: response } = await api.get(`/user/address/`, {
      params: {
        search,
        limit: address.filteredPagination.limit,
        offset: (Number(page) - 1) * address.filteredPagination.limit
      },
      cancelToken: cancelFetchRequest.cancelRequest.token
    })
    cancelFetchRequest.resetCancelToken()
    return {
      append,
      addressBooks: response.results,
      pagination: {
        ...address.filteredPagination,
        currentPage: page,
        total: response.count
      }
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
    setPagination: (state, action: PayloadAction<PaginationInterface>) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      }
    },
    setFilteredPagination: (
      state,
      action: PayloadAction<PaginationInterface>
    ) => {
      state.filteredPagination = {
        ...state.filteredPagination,
        ...action.payload
      }
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
        state.pagination = action.payload.pagination
        state.error = ""
      }
    )
    builder.addCase(fetchAddressBook.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
    builder.addCase(fetchFilteredAddressBook.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchFilteredAddressBook.fulfilled,
      (state, action: PayloadAction<AddressBookState>) => {
        state.loading = false
        if (action.payload.append) {
          state.filteredAddressBooks = [
            ...state.filteredAddressBooks,
            ...action.payload.addressBooks
          ]
        } else {
          state.filteredAddressBooks = action.payload.addressBooks
        }
        state.filteredPagination = action.payload.pagination
        state.error = ""
      }
    )
    builder.addCase(fetchFilteredAddressBook.rejected, (state, action) => {
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

export const { setPagination, setFilteredPagination } = addressBookSlice.actions

export default addressBookSlice.reducer
