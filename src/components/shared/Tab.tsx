import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { TabProps } from "./Tab.d"

const getTabStyles = (type: "solid" | "plain", isActive: boolean) => {
  switch (type) {
    case "solid":
      return `rounded-lg gap-x-1 ${
        isActive
          ? "bg-background-tertiary text-content-primary"
          : "text-content-secondary"
      }`
    case "plain":
      return `gap-x-2 ${isActive ? "text-primary" : "text-content-secondary"}`
    default:
      return null
  }
}

export const Tab: FC<TabProps> = (props) => {
  const {
    type = "solid",
    isActive,
    children,
    title,
    startIcon,
    count,
    className,
    onClick
  } = props

  const tabStyles = getTabStyles(type, isActive)

  return (
    <>
      <button
        type="button"
        className={twMerge(
          `relative flex items-center px-6 py-2 w-max focus:outline-0 transition duration-300 ${tabStyles}`,
          className ?? ""
        )}
        onClick={onClick}
      >
        {startIcon && (
          <span
            className={twMerge(
              "text-xl w-max",
              isActive ? "text-primary" : "text-content-contrast"
            )}
          >
            {startIcon}
          </span>
        )}
        <span className="text-subtitle-sm font-medium w-max">
          {children ? children : title}
        </span>
        {count && count > 0 ? (
          <span
            className={`h-4 px-[5px] text-caption-sm bg-background-tertiary text-primary-contrast grid place-content-center rounded-full outline outline-1 outline-outline outline-offset-[-1px]`}
          >
            {count < 100 ? count : `99+`}
          </span>
        ) : (
          ""
        )}
        {type === "plain" && (
          <div
            className={`absolute h-0.5 bg-primary left-0 -bottom-[1px] transition-all duration-300 ${
              isActive ? "w-full ease-out" : "w-0 ease-in"
            }`}
          />
        )}
      </button>
    </>
  )
}
