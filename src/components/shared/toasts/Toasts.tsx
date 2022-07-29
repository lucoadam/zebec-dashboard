import React, { FC } from "react"
import { useAppSelector } from "app/hooks"
import { Toast } from "./Toast"
import { ToastPropertiesProps } from "features/toasts/toastsSlice.d"
import { twMerge } from "tailwind-merge"

const getPositionStyle = (position: ToastPropertiesProps["position"]) => {
  switch (position) {
    case "bottom-right":
      return `bottom-5 right-5`
    case "top-right":
      return `top-5 right-5`
    case "bottom-left":
      return `bottom-5 left-5`
    case "top-left":
      return `top-5 left-5`
    default:
      return null
  }
}

export const Toasts: FC<ToastPropertiesProps> = (props) => {
  const { position = "bottom-right" } = props
  const { toasts } = useAppSelector((state) => state.toasts)

  const positionStyle = getPositionStyle(position)

  return (
    <>
      <div
        className={twMerge(
          `fixed max-w-md w-full space-y-4 z-50`,
          positionStyle
        )}
      >
        {toasts.map((toast) => {
          return <Toast key={toast.id} position={position} {...toast} />
        })}
      </div>
    </>
  )
}
