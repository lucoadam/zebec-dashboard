type ToastType = "success" | "error" | "info"

export interface ToastObjectProps {
  title?: string
  message: string | Error
  transactionHash?: string
  autoClose?: number
}

export interface ToastProps extends ToastObjectProps {
  type: ToastType
  id: number
}

export interface ToastPropertiesProps {
  position?: "bottom-right" | "top-right" | "bottom-left" | "top-left"
}

export interface ToastsProps {
  toasts: ToastProps[]
}

export const defaultAutoCloseTime = 5000
