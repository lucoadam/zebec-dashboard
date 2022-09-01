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
  const zebecTokensBalance =
    useAppSelector((state) => state.zebecBalance?.tokens) || []
  const zebecStreamingTokensBalance =
    useAppSelector((state) => state.zebecStreamingBalance?.tokens) || []
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
        <div className="grid grid-flow-dense gap-y-6">
          <Balances />
        </div>
        {/* 2nd and 3rd column */}
        <div className="lg:col-span-2 grid lg:grid-cols-2 gap-6">
          {/* Deposited Assets */}
          <div className="grid lg:grid-rows-2 lg:grid-cols-2 gap-4 lg:col-span-2">
            <div className="row-span-2">
              <DepositedAssets
                balanceTokens={zebecTokensBalance}
                streamingBalanceTokens={zebecStreamingTokensBalance}
                tokens={tokenDetails}
              />
            </div>
            {/* Deposit | Withdraw and Farms */}
            <div className="order-first lg:order-none">
              <DepositWithdraw tabs={tabs} />
            </div>
            <div className="">
              <Farms />
            </div>
          </div>
          {/* Recent Transactions */}
          <RecentTransactions className="hidden lg:flex" />
        </div>
        {/* Recent Transactions */}
        <RecentTransactions className="flex lg:hidden" />
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
