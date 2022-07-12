import React, { FC } from "react"
import { twMerge } from "tailwind-merge"

interface TableBodyProps {
  className?: string
  children: React.ReactNode
}

export const TableBody: FC<TableBodyProps> = ({ className, children }) => {
  return (
    <>
      <tbody
        className={twMerge(
          `table px-6 py-5 w-full rounded-lg bg-background-secondary border-separate divide-y divide-outline`,
          className ?? ""
        )}
      >
        {children}
      </tbody>
    </>
  )
}
