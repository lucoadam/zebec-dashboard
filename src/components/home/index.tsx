import React, { FC } from "react"
import Balances from "./Balances"
import DepositedAssets from "./DepositedAssets"
import DepositWithdraw from "./DepositWithdraw"
import Farms from "./Farms"
import RecentTransactions from "./RecentTransactions"

const HomePage: FC = () => {
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1st column | Balances */}
        <div className="grid gap-y-6">
          <Balances />
        </div>
        {/* 2nd and 3rd column */}
        <div className="lg:col-span-2 grid lg:grid-cols-2 gap-6">
          {/* Deposited Assets */}
          <DepositedAssets />
          {/* Deposit | Withdraw and Farms */}
          <div className="grid gap-y-6">
            <DepositWithdraw />
            <Farms />
          </div>
          {/* Recent Transactions */}
          <RecentTransactions />
        </div>
      </div>
    </>
  )
}

export default HomePage
