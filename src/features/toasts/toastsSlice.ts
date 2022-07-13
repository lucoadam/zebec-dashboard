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
      state.toasts.push({ type: "success", ...action.payload })
    },
    error: (state, action: PayloadAction<ToastObjectProps>) => {
      state.toasts.push({ type: "error", ...action.payload })
    },
    info: (state, action: PayloadAction<ToastObjectProps>) => {
      state.toasts.push({ type: "info", ...action.payload })
    },
    removeToast: (state, action: PayloadAction<number>) => {
      state.toasts.filter((toast) => toast.id !== action.payload)
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
export const removeToast = toastSlice.actions

export default toastSlice.reducer
