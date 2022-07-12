import React, { FC } from "react"
import { Button } from "components/shared"
import * as Icons from "assets/icons"

const RecentTransactions: FC = () => {
  return (
    <>
      <div className="lg:col-span-2 p-6 rounded bg-background-secondary flex flex-col gap-y-6 h-96">
        <div className="flex justify-between items-center">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            RECENT TRANSACTIONS
          </div>
          <Button
            size="small"
            title="View All"
            endIcon={<Icons.ArrowRightIcon />}
          />
        </div>
      </div>
    </>
  )
}

export default RecentTransactions
