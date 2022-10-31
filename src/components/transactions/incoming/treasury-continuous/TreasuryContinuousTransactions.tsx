import { FC, useState } from "react"
import FilterTabs from "../../FilterTabs"
import { TreasuryAllContinuous } from "./tabs/TreasuryAllContinuous"
import { TreasuryOngoingContinuous } from "./tabs/TreasuryOngoingContinuous"
import { TreasuryCompletedContinuous } from "./tabs/TreasuryCompletedContinuous"
import { TreasuryScheduledContinuous } from "./tabs/TreasuryScheduledContinuous"
import * as Icons from "assets/icons"

const TreasuryContinuousTransactions: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      title: "All",
      component: <TreasuryAllContinuous />
    },
    {
      title: "Scheduled",
      component: <TreasuryScheduledContinuous />,
      icon: <Icons.CalenderIcon />
    },
    {
      title: "Ongoing",
      component: <TreasuryOngoingContinuous />,
      icon: <Icons.DoubleCircleDottedLineIcon />
    },
    {
      title: "Completed",
      component: <TreasuryCompletedContinuous />,
      icon: <Icons.CheckCircleIcon />
    }
  ]

  return (
    <>
      {/* Tabs */}
      <FilterTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Table */}
      {tabs[activeTab].component}
    </>
  )
}

export default TreasuryContinuousTransactions
