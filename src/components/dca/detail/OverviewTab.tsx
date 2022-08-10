import * as Icons from "assets/icons"
import { SupportCardComponents, Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import { useState } from "react"
import { Balances } from "./Balances"
import { Deposit } from "./Deposit"
import { Overview } from "./Overview"
import { Withdrawal } from "./Withdrawal"

const fundTransferTabs = [
  {
    title: "common:buttons.add-funds",
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

export const OverviewTab = () => {
  const { t } = useTranslation()
  const dca = {
    id: 1,
    token0: "USDC",
    token1: "SOL",
    refresh: "Daily",
    balance: 20.05,
    next: "27th April, 2022",
    token0PercentageChange: 2,
    token1PercentageChange: -2,
    token0AmountChange: 2.5,
    token1AmountChange: -1.2
  }
  const [activePage, setActivePage] = useState<number>(0)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Overview dca={dca} />
      {/* 1st column | Balances */}
      <div className="md:grid col-span-2 gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Balances />
          <div className="w-full pt-3 rounded bg-background-secondary">
            <div className="flex items-center border-b border-outline pt-2">
              {fundTransferTabs.map((fundTranfer, index) => {
                return (
                  <Tab
                    key={fundTranfer.title}
                    type="plain"
                    className="w-1/2 justify-center"
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
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <SupportCardComponents.ZebecHelp page="dca" />
          <SupportCardComponents.SendFeedback />
        </div>
      </div>
    </div>
  )
}
