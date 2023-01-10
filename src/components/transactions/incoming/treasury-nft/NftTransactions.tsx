import { FC, useState } from "react"
import FilterTabs from "../../FilterTabs"
import { AllNft } from "./tabs/AllNft"
import { CancelledNft } from "./tabs/CancelledNft"
import { CompletedNft } from "./tabs/CompletedNft"
import { ScheduledNft } from "./tabs/ScheduledNft"
import * as Icons from "assets/icons"

const NftTransactions: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      title: "All",
      component: <AllNft />
    },
    {
      title: "Scheduled",
      component: <ScheduledNft />,
      icon: <Icons.CalenderIcon />
    },
    {
      title: "Completed",
      component: <CompletedNft />,
      icon: <Icons.CheckCircleIcon />
    },
    {
      title: "Cancelled",
      component: <CancelledNft />,
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
