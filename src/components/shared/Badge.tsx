import React, { FC } from "react"
import { twMerge } from "tailwind-merge"

interface BadgeTypeProps {
  type: "info" | "success" | "error"
  title?: "Copied"
}

interface BadgeProps {
  children?: React.ReactNode
  size?: "medium" | "small"
  className?: string
}

interface CopyBadgeProps extends BadgeProps {
  type?: "success"
  content: string
  show: boolean
}

export const Badge: FC<BadgeProps & BadgeTypeProps> = (props) => {
  const { children, title, type, size = "medium", className } = props
  const badgeSizeStyles =
    size === "medium"
      ? "text-button-sm px-2 py-[5px]"
      : "text-caption-sm leading-none px-1.5 py-1"
  const badgeTypeStyles =
    type === "info"
      ? "bg-primary text-content-primary"
      : type === "success"
      ? "bg-success text-background-tertiary"
      : type === "error"
      ? "bg-error text-content-primary"
      : null
  return (
    <>
      <div
        className={twMerge(
          `rounded-md whitespace-nowrap w-max ${badgeSizeStyles} ${badgeTypeStyles}`,
          className ?? ""
        )}
      >
        {children ? children : title}
      </div>
    </>
  )
}
