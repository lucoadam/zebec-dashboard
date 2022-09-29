import { FC, useState } from "react"
import { FilterTabs, Tab } from "../FilterTabs"
import { AllWithdrawl } from "./tabs/AllWithdrawl"
import { PendingWithdrawl } from "./tabs/PendingWithdrawl"
import { AcceptedWithdrawl } from "./tabs/AcceptedWithdrawl"
import { RejectedWithdrawl } from "./tabs/RejectedWithdrawl"
import * as Icons from "assets/icons"

const WithdrawlTransactions: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs: Tab[] = [
    {
      title: "All",
      component: <AllWithdrawl />,
      icon: <Icons.TransactionIcon />
    },
    {
      title: "Pending",
      component: <PendingWithdrawl />,
      icon: <Icons.SparkleIcon />
    },
    {
      title: "Accepted",
      component: <AcceptedWithdrawl />,
      icon: <Icons.CheckCircleIcon />
    },
    {
      title: "Rejected",
      component: <RejectedWithdrawl />,
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

export default WithdrawlTransactions
