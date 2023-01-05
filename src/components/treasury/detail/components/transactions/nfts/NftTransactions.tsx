import { FC, useState } from "react"
import { FilterTabs, Tab } from "./../FilterTabs"
import { AllNft } from "./tabs/AllNft"
import { PendingNft } from "./tabs/PendingNft"
import { AcceptedNft } from "./tabs/AcceptedNft"
import { RejectedNft } from "./tabs/RejectedNft"
import * as Icons from "assets/icons"

const NftTransactions: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs: Tab[] = [
    {
      title: "All",
      component: <AllNft />,
      icon: <Icons.TransactionIcon />
    },
    {
      title: "Pending",
      component: <PendingNft />,
      icon: <Icons.SparkleIcon />
    },
    {
      title: "Accepted",
      component: <AcceptedNft />,
      icon: <Icons.CheckCircleIcon />
    },
    {
      title: "Rejected",
      component: <RejectedNft />,
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

export default NftTransactions
