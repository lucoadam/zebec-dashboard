import { FC, useState } from "react"
import { FilterTabs, Tab } from "./../FilterTabs"
import { AllInstant } from "./tabs/AllInstant"
import { PendingInstant } from "./tabs/PendingInstant"
import { AcceptedInstant } from "./tabs/AcceptedInstant"
import { RejectedInstant } from "./tabs/RejectedInstant"
import * as Icons from "assets/icons"

const InstantTransactions: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs: Tab[] = [
    {
      title: "All",
      component: <AllInstant />,
      icon: <Icons.TransactionIcon />
    },
    {
      title: "Pending",
      component: <PendingInstant />,
      icon: <Icons.SparkleIcon />
    },
    {
      title: "Accepted",
      component: <AcceptedInstant />,
      icon: <Icons.CheckCircleIcon />
    },
    {
      title: "Rejected",
      component: <RejectedInstant />,
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
