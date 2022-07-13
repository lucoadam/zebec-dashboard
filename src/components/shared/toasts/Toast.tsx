import React, { FC, Fragment, useEffect, useState } from "react"
import { useAppDispatch } from "app/hooks"
import { Button } from "../Button"
import { Transition } from "@headlessui/react"
import {
  ToastPropertiesProps,
  ToastProps
  // defaultAutoCloseTime
} from "features/toasts/toastsSlice.d"
import { removeToast } from "features/toasts/toastsSlice"
import * as Icons from "assets/icons"

interface ActiveTostProps extends ToastProps {
  position: ToastPropertiesProps["position"]
}

const getPositionStyle = (position: ToastPropertiesProps["position"]) => {
  switch (position) {
    case "bottom-right":
    case "top-right":
      return `translate-x-full`
    case "bottom-left":
    case "top-left":
      return `-translate-x-full`
    default:
      return null
  }
}

export const Toast: FC<ActiveTostProps> = ({ position, ...toast }) => {
  const dispatch = useAppDispatch()
  const [showToast, setShowToast] = useState(false)
  const { type, id, title, message, link, autoClose } = toast

  useEffect(() => {
    //set showToast to true for animation on load
    setShowToast(true)
    //set showToast to false befor autoCloseTimeout for animation
    setTimeout(() => {
      setShowToast(false)
    }, 5000 - 500)
    //Remove toaster from redux after autoCloseTimeout
    const timer = setTimeout(() => {
      dispatch(removeToast(id))
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const positionStyle = getPositionStyle(position)

  const progressBarStyle = {
    animationDuration: `${4500 / 1000 + "s"}`
  }

  return (
    <>
      <Transition
        as={Fragment}
        show={showToast}
        enter="transition-all ease-out duration-500"
        enterFrom={`transform opacity-100 ${positionStyle}`}
        enterTo="transform opacity-100 translate-x-0"
        leave="transition ease-in duration-500"
        leaveFrom="transform opacity-100 translate-x-0"
        leaveTo={`transform opacity-100 ${positionStyle}`}
      >
        <div className="rounded-t-md shadow-toaster overflow-hidden">
          <div className="px-4 pt-4 pb-5 flex items-center gap-x-3 bg-outline backdrop-blur-[120px]">
            <div className="h-7 w-7 rounded-xl grid place-content-center bg-purple-200"></div>
            <div className="flex-1 flex flex-col">
              <div className="text-content-primary text-subtitle font-semibold">
                {title ?? <div className=" capitalize">{type}</div>}
              </div>
              <div className="text-content-secondary text-body">{message}</div>
            </div>
            {link && (
              <Button
                size="small"
                title="View Explorer"
                endIcon={<Icons.OutsideLinkIcon />}
              />
            )}
          </div>
          <div className="w-full h-0.5 bg-content-contrast relative">
            <div
              className="absolute h-0.5 w-0 bg-success animate-progress"
              style={progressBarStyle}
            ></div>
          </div>
        </div>
      </Transition>
    </>
  )
}
