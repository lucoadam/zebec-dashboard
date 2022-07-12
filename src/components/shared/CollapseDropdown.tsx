import React, { FC, Fragment } from "react"
import { Transition } from "@headlessui/react"
import { twMerge } from "tailwind-merge"

type PositionStyle = "right" | "left"

interface CollapseDropdownProps {
  children: React.ReactNode
  show: boolean
  variant?: "default" | "light"
  className?: string
  position?: PositionStyle
  ref?: React.RefObject<HTMLDivElement>
}

const getPositionStyle = (position: PositionStyle) => {
  switch (position) {
    case "left":
      return `left-0`
    case "right":
      return `right-0`
    default:
      return null
  }
}
const getVariantStyle = (variant: "default" | "light") => {
  switch (variant) {
    case "light":
      return `bg-background-primary`
    case "default":
      return `bg-background-light`
    default:
      return null
  }
}

export const CollapseDropdown: FC<CollapseDropdownProps> = (props) => {
  const {
    children,
    show,
    className,
    position = "right",
    variant = "default",
    ...rest
  } = props

  const positionStyle = getPositionStyle(position)
  const variantStyles = getVariantStyle(variant)
  const defaultClasses = `divide-y divide-outline-secondary top-10 z-10 ${positionStyle} ${variantStyles}`

  return (
    <>
      <Transition
        as={Fragment}
        show={show}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-75"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-75"
      >
        <div
          className={twMerge(
            `absolute flex flex-col rounded-lg ${defaultClasses}`,
            className ?? ""
          )}
          {...rest}
        >
          {children}
        </div>
      </Transition>
    </>
  )
}
