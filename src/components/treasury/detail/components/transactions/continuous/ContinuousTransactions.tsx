import { FC, useState } from "react"
import { FilterTabs, Tab } from "./../FilterTabs"
import { AllContinuous } from "./tabs/AllContinuous"
import { PendingContinuous } from "./tabs/PendingContinuous"
import { AccepteContinuous } from "./tabs/AcceptedContinuous"
import { RejectedContinuous } from "./tabs/RejectedContinuous"
import * as Icons from "assets/icons"

const ContinuousTransactions: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs: Tab[] = [
    {
      title: "All",
      component: <AllContinuous />,
      icon: <Icons.TransactionIcon />
    },
    {
      title: "Pending",
      component: <PendingContinuous />,
      icon: <Icons.SparkleIcon />
    },
    {
      title: "Accepted",
      component: <AccepteContinuous />,
      icon: <Icons.CheckCircleIcon />
    },
    {
      title: "Rejected",
      component: <RejectedContinuous />,
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

export default ContinuousTransactions
