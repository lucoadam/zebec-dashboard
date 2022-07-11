import EmptyState from "assets/images/transactions/empty-state.svg"
import { FC, ReactNode } from "react"

interface EmptyDataProps {
  button?: ReactNode
  message: string
}

export const EmptyDataState: FC<EmptyDataProps> = ({ button, message }) => {
  return (
    <div className="bg-background-secondary flex flex-col items-center py-[176.5px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <EmptyState className="w-60 h-32" />
      <div className="text-body text-content-primary mt-10">{message}</div>
      {button && <span className="mt-6">{button ?? ""}</span>}
    </div>
  )
}
