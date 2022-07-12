import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import DepositedAssets from "components/home/DepositedAssets"
import {
  ActivityThisWeek,
  DepositedBalance,
  Tab,
  Tokens,
  ZebecHelp
} from "components/shared"
import { SendFeedback } from "components/shared/SendFeedback"
import { useTranslation } from "next-i18next"
import { useState } from "react"
import { Deposit } from "./Deposit"
import { Withdrawal } from "./Withdrawal"

const fundTransferTabs = [
  {
    title: "Deposit",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <Deposit />
  },
  {
    title: "Withdrawal",
    icon: <Icons.ArrowUpRightIcon />,
    count: 0,
    Component: <Withdrawal />
  }
]

const Overview = () => {
  const { t } = useTranslation()

  const [activePage, setActivePage] = useState<number>(0)
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 gap-6">
      {/**
       * First Column
       *    1. Safe Balance
       *    2. Incoming/ Outgoing
       *    3. Activity this Week
       */}
      <div className="grid gap-y-6 flex-col justify-between">
        {/**
         * Safe Balance
         */}
        <DepositedBalance />
        {/**
         * Incoming/ Outgoing
         */}
        <Tokens />
        {/**
         * Activity this week
         */}
        <ActivityThisWeek />
      </div>
      {/**
       * Second Column
       *   1. Deposited Assets
       * **/}
      <div>
        <DepositedAssets balanceTokens={treasuryTokens} tokens={tokenDetails} />
      </div>
      <div className="grid md:grid-cols-2 md:gap-6 lg:col-span-1 lg:grid-cols-1 md:col-span-2 md:flex-row md:flex-wrap flex-col justify-between">
        {/**
         * Deposit and Withdrawal
         */}
        <div className="w-full pt-3 rounded bg-background-secondary">
          <div className="flex">
            {fundTransferTabs.map((fundTranfer, index) => {
              return (
                <Tab
                  key={fundTranfer.title}
                  type="plain"
                  className="w-1/2"
                  title={`${t(
                    `treasuryOverview:${fundTranfer.title.toLowerCase()}`
                  )}`}
                  isActive={activePage === index}
                  startIcon={fundTranfer.icon}
                  count={fundTranfer.count}
                  onClick={() => setActivePage(index)}
                />
              )
            })}
          </div>
          <div className="px-6 mt-6 pb-6 min-h-[210px]">
            {fundTransferTabs[activePage].Component}
          </div>
        </div>
        {/**
         * Zebec Treasury Help
         */}
        <ZebecHelp />
        {/**
         * Send Feedback
         */}
        <SendFeedback />
      </div>
    </div>
  )
}

export default Overview
