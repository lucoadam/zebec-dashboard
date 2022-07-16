import EmptyState from "assets/images/transactions/empty-state.svg"
import { FC, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface EmptyDataProps {
  button?: ReactNode
  message: string
  padding?: number
  className?: string
  emptyStateClassName?: string
  messageClassName?: string
}

export const EmptyDataState: FC<EmptyDataProps> = ({
  button,
  message,
  padding = 176.5,
  className,
  emptyStateClassName,
  messageClassName
}) => {
  return (
    <div
      className={twMerge(
        "bg-background-secondary w-full flex flex-col items-center",
        className ?? ""
      )}
      style={{
        padding: `${padding}px 0`
      }}
    >
      <EmptyState className={twMerge("w-60 h-32", emptyStateClassName)} />
      <div
        className={twMerge(
          "text-body text-content-primary mt-10",
          messageClassName ?? ""
        )}
      >
        {message}
      </div>
      {button && <span className="mt-6">{button ?? ""}</span>}
    </div>
  )
}
