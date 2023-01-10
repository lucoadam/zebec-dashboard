import React, { FC, Fragment, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Button } from "../Button"
import { Transition } from "@headlessui/react"
import {
  ToastPropertiesProps,
  ToastProps,
  defaultAutoCloseTime
} from "features/toasts/toastsSlice.d"
import { removeToast } from "features/toasts/toastsSlice"
import { twMerge } from "tailwind-merge"
import * as Icons from "assets/icons"
import { getExplorerUrl } from "constants/explorers"

interface ActiveTostProps extends ToastProps {
  position: ToastPropertiesProps["position"]
}

const getPositionStyle = (position: ToastPropertiesProps["position"]) => {
  switch (position) {
    case "bottom-right":
      return `translate-x-full`
    case "top-right":
      return `translate-x-full`
    case "bottom-left":
      return `-translate-x-full`
    case "top-left":
      return `-translate-x-full`
    default:
      return ``
  }
}

export const Toast: FC<ActiveTostProps> = ({ position, ...toast }) => {
  const dispatch = useAppDispatch()
  const [showToast, setShowToast] = useState(false)
  const { type, id, title, message, transactionHash, autoClose } = toast
  const { explorer } = useAppSelector((state) => state.settings)

  useEffect(() => {
    //set showToast to true for animation on load
    setShowToast(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(removeToast(id))
    }, toast?.autoClose ?? defaultAutoCloseTime)

    const intervalShowToast = setInterval(
      () => {
        setShowToast(false)
      },
      autoClose ? autoClose - 500 : defaultAutoCloseTime - 500
    )

    return () => {
      clearInterval(interval)
      clearInterval(intervalShowToast)
    }
    // eslint-disable-next-line
  }, [])

  const positionStyle = getPositionStyle(position)

  const progressBarStyle = {
    animationDuration: `${
      autoClose
        ? (autoClose - 500) / 1000 + "s"
        : (defaultAutoCloseTime - 500) / 1000 + "s"
    }`
  }

  const typeClasses = {
    background: type === "info" ? `bg-primary` : `bg-${type}`,
    color: type === "info" ? `text-primary` : `text-${type}`
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
        <div className="rounded-t-md shadow-3 dark:shadow-toaster overflow-hidden">
          <div className="px-4 pt-4 pb-5 flex items-center gap-x-3 bg-background-primary rounded-t-md border border-b-0 border-outline dark:border-0 dark:bg-outline dark:backdrop-blur-[120px]">
            <div
              className={twMerge(
                `h-7 w-7 rounded-xl grid place-content-center text-content-primary flex-shrink-0`,
                typeClasses.background
              )}
            >
              {type === "success" ? (
                <Icons.CheckIcon />
              ) : type === "error" ? (
                <Icons.CrossIcon />
              ) : type === "info" ? (
                <Icons.InformationIcon className="w-4.5 h-4.5" />
              ) : (
                ""
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <div
                className={twMerge(
                  `"text-content-primary text-subtitle font-semibold`,
                  typeClasses.color
                )}
              >
                {title ?? <div className=" capitalize">{type}</div>}
              </div>
              <div className="text-content-secondary text-body">
                {typeof message === "string" && message}
              </div>
            </div>
            {transactionHash && (
              <a
                href={getExplorerUrl(explorer, transactionHash)}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="small"
                  title="View Explorer"
                  endIcon={<Icons.OutsideLinkIcon />}
                />
              </a>
            )}
          </div>
          <div className="w-full h-0.5 bg-background-light dark:bg-content-contrast relative">
            <div
              className={twMerge(
                `absolute h-full w-0 bg-success animate-progress`,
                typeClasses.background
              )}
              style={progressBarStyle}
            ></div>
          </div>
        </div>
      </Transition>
    </>
  )
}
