import { FC, useState } from "react"
import FilterTabs from "./../../FilterTabs"
import { AllContinuous } from "./tabs/AllContinuous"
import { OngoingContinuous } from "./tabs/OngoingContinuous"
import { CompletedContinuous } from "./tabs/CompletedContinuous"
import { ScheduledContinuous } from "./tabs/ScheduledContinuous"
import * as Icons from "assets/icons"

const ContinuousTransactions: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      title: "All",
      component: <AllContinuous />
    },
    {
      title: "Scheduled",
      component: <ScheduledContinuous />,
      icon: <Icons.CloseCircleIcon />
    },
    {
      title: "Ongoing",
      component: <OngoingContinuous />,
      icon: <Icons.CalenderIcon />
    },
    {
      title: "Completed",
      component: <CompletedContinuous />,
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

export default ContinuousTransactions
