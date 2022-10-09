import { FC, useState } from "react"
import FilterTabs from "./../../FilterTabs"
import { AllInstant } from "./tabs/AllInstant"
import { CancelledInstant } from "./tabs/CancelledInstant"
import { CompletedInstant } from "./tabs/CompletedInstant"
import { ScheduledInstant } from "./tabs/ScheduledInstant"
import * as Icons from "assets/icons"

const InstantTransactions: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      title: "All",
      component: <AllInstant />
    },
    {
      title: "Scheduled",
      component: <ScheduledInstant />,
      icon: <Icons.CalenderIcon />
    },
    {
      title: "Completed",
      component: <CompletedInstant />,
      icon: <Icons.CheckCircleIcon />
    },
    {
      title: "Cancelled",
      component: <CancelledInstant />,
      icon: <Icons.CloseCircleIcon />
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

export default InstantTransactions
