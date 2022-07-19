import * as Icons from "assets/icons"
import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"
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

const DepositWithdraw: FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { t } = useTranslation()
  return (
    <>
      <div className="rounded bg-background-secondary flex flex-col">
        <div className="flex border-b border-outline">
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={tab.title}
                type="plain"
                title={`${t(tab.title)}`}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
                startIcon={tab.icon}
                className="w-1/2 pt-4 justify-center"
              />
            )
          })}
        </div>
        {/* Active Tab */}
        {tabs[activeTab].Component}
      </div>
    </>
  )
}

export default DepositWithdraw
