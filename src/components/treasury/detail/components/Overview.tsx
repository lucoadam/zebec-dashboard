import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import DepositedAssets from "components/home/DepositedAssets"
import {
  ActivityThisWeek,
  DepositedBalance,
  SupportCard,
  Tokens,
  DepositWithdraw
} from "components/shared"
import { tokenBalances, weeklyBalances } from "fakedata"
import { useState } from "react"
import { Deposit } from "./Deposit"
import { Withdrawal } from "./Withdrawal"

const fundTransferTabs = [
  {
    title: "common:buttons.deposit",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <Deposit />
  },
  {
    title: "common:buttons.withdraw",
    icon: <Icons.ArrowUpRightIcon />,
    count: 0,
    Component: <Withdrawal />
  }
]

const Overview = () => {
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  const [currentToken, setCurrentToken] = useState<
    keyof typeof tokenBalances | keyof typeof weeklyBalances
  >("SOL")
  const treasuryBalance = useAppSelector(
    (state) => state.treasuryBalance.treasury?.tokens
  )
  const prices = useAppSelector((state) => state.tokenDetails.prices)
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
        <DepositedBalance
          balance={treasuryBalance?.reduce(
            (a, b) => a + (prices[b.symbol] * b.balance || 0),
            0
          )}
        />
        {/**
         * Incoming/ Outgoing
         */}
        <Tokens currentToken={currentToken} setCurrentToken={setCurrentToken} />
        {/**
         * Activity this week
         */}
        <ActivityThisWeek currentToken={currentToken} />
      </div>
      {/**
       * Second Column
       *   1. Deposited Assets
       * **/}
      <div>
        <DepositedAssets
          tableMaxHeight={554}
          balanceTokens={treasuryTokens}
          tokens={tokenDetails}
        />
      </div>
      <div className="grid md:grid-cols-2 md:gap-6 lg:col-span-1 lg:grid-cols-1 md:col-span-2 md:flex-row md:flex-wrap flex-col justify-between">
        {/**
         * Deposit and Withdrawal
         */}
        {/* <div className="w-full pt-3 rounded bg-background-secondary">
          <div className="flex">
            {fundTransferTabs.map((fundTranfer, index) => {
              return (
                <Tab
                  key={fundTranfer.title}
                  type="plain"
                  className="w-1/2"
                  title={`${t(fundTranfer.title)}`}
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
        </div> */}
        <DepositWithdraw tabs={fundTransferTabs} />
        {/**
         * Zebec Treasury Help
         */}
        <SupportCard
          title="treasuryOverview:treasury-help"
          description="treasuryOverview:treasury-help-description"
          buttons={[
            {
              title: "common:support.check-faq"
            },
            {
              title: "common:support.join-discord"
            }
          ]}
        />
        {/**
         * Send Feedback
         */}
        <SupportCard
          title="treasuryOverview:send-feedback"
          description="treasuryOverview:feedback-description"
          buttons={[
            {
              title: "treasuryOverview:send-us-message"
            }
          ]}
        />
      </div>
    </div>
  )
}

export default Overview
