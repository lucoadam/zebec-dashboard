import { useAppDispatch, useAppSelector } from "app/hooks"
import { FC, useEffect } from "react"
import Balances from "./Balances"
import DepositedAssets from "./DepositedAssets"
import { DepositWithdraw, SupportCardComponents } from "components/shared"
import Farms from "./Farms"
import RecentTransactions from "./RecentTransactions"
import * as Icons from "assets/icons"
import DepositTab from "./DepositTab"
import WithdrawTab from "./WithdrawTab"
import {
  fetchOverallActivity,
  fetchWeeklyActivity
} from "features/transactions/transactionsSlice"

const tabs = [
  {
    title: "common:buttons.deposit",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <DepositTab />
  },
  {
    title: "common:buttons.withdraw",
    icon: <Icons.ArrowUpRightIcon />,
    count: 2,
    Component: <WithdrawTab />
  }
]

const HomePage: FC = () => {
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryTokens =
    useAppSelector((state) => state.zebecBalance?.tokens) || []
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (isSigned) {
      dispatch(fetchWeeklyActivity())
      dispatch(fetchOverallActivity())
    }
  }, [isSigned, dispatch])
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
          <DepositedAssets
            balanceTokens={treasuryTokens}
            tokens={tokenDetails}
          />
          {/* Deposit | Withdraw and Farms */}
          <div className="grid gap-y-6">
            <DepositWithdraw tabs={tabs} />
            <Farms />
          </div>
          {/* Recent Transactions */}
          <RecentTransactions />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-6 mt-6">
        <SupportCardComponents.ZebecHelp />
        <SupportCardComponents.BuildWithZebec />
        <SupportCardComponents.SendFeedback />
      </div>
    </>
  )
}

export default HomePage
