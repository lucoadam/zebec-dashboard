import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"

interface Tab {
  title: string
  icon: JSX.Element
  count: number
  Component: JSX.Element
}

interface DepositWithdrawProps {
  tabs: Tab[]
}

export const DepositWithdraw: FC<DepositWithdrawProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { t } = useTranslation()
  return (
    <>
      <div className="rounded bg-background-secondary flex flex-col">
        <div className="flex items-center border-b border-outline pt-2">
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={tab.title}
                type="plain"
                title={`${t(tab.title)}`}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
                startIcon={tab.icon}
                className="w-1/2 justify-center"
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
