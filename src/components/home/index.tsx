import { useAppSelector } from "app/hooks"
import { FC } from "react"
import Balances from "./Balances"
import DepositedAssets from "./DepositedAssets"
import { DepositWithdraw, SupportCard } from "components/shared"
import Farms from "./Farms"
import RecentTransactions from "./RecentTransactions"
import * as Icons from "assets/icons"
import DepositTab from "./DepositTab"
import WithdrawTab from "./WithdrawTab"

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
        <SupportCard
          title="common:zebec-help"
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
        <SupportCard
          title="treasuryOverview:build-with-zebec"
          description="treasuryOverview:build-description"
          buttons={[
            {
              title: "treasuryOverview:check-documentation"
            }
          ]}
        />
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
    </>
  )
}

export default HomePage
