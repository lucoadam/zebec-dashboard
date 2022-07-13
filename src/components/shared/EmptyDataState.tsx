import EmptyState from "assets/images/transactions/empty-state.svg"
import { FC, ReactNode } from "react"

interface EmptyDataProps {
  button?: ReactNode
  message: string
  padding?: number
}

export const EmptyDataState: FC<EmptyDataProps> = ({
  button,
  message,
  padding = 176.5
}) => {
  return (
    <div
      className="bg-background-secondary w-full flex flex-col items-center"
      style={{
        padding: `${padding}px 0`
      }}
    >
      <EmptyState className="w-60 h-32" />
      <div className="text-body text-content-primary mt-10">{message}</div>
      {button && <span className="mt-6">{button ?? ""}</span>}
    </div>
  )
}
