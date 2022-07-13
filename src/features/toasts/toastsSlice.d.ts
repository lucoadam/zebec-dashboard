type ToastType = "success" | "error" | "info"

export interface ToastObjectProps {
  id: number
  title?: string
  message: string
  link?: string
}

export interface ToastProps extends ToastObjectProps {
  type: ToastType
}

export interface ToastsProps {
  toasts: ToastProps[]
}
