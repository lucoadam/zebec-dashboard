import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ToastObjectProps, ToastsProps } from "./toastsSlice.d"

const initialState: ToastsProps = {
  toasts: []
}

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    success: (state, action: PayloadAction<ToastObjectProps>) => {
      const currentTime = Date.now()
      state.toasts.push({
        type: "success",
        id: currentTime,
        ...action.payload
      })
    },
    error: (state, action: PayloadAction<ToastObjectProps>) => {
      const currentTime = Date.now()
      state.toasts.push({
        type: "error",
        id: currentTime,
        ...action.payload
      })
    },
    info: (state, action: PayloadAction<ToastObjectProps>) => {
      const currentTime = Date.now()
      state.toasts.push({
        type: "info",
        id: currentTime,
        ...action.payload
      })
    },
    removeToast: (state, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    }
  }
})

// export const getToastsState = (state: { toasts: ToastProps }) => state.toasts

const { success, error, info } = toastSlice.actions

export const toast = {
  success,
  error,
  info
}
export const { removeToast } = toastSlice.actions

export default toastSlice.reducer
