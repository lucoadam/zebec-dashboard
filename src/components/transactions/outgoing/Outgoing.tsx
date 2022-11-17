import { Breadcrumb } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import FilterTabs, { Tab } from "../FilterTabs"
import * as Icons from "assets/icons"
import {
  fetchOutgoingTransactions,
  resetTimedStatusTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { AllOutgoing } from "./tabs/AllIOutgoing"
import { OngoingOutgoing } from "./tabs/OngoingOutgoing"
import { ScheduledOutgoing } from "./tabs/ScheduledOutgoing"
import { CompletedOutgoing } from "./tabs/CompletedOutgoing"
import { useZebecWallet } from "hooks/useWallet"

const Outgoing: FC = () => {
  const { t } = useTranslation("transactions")
  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.common)
  const { originalAddress } = useZebecWallet()
  const [activeTab, setActiveTab] = useState(0)

  const tabs: Tab[] = [
    {
      title: "All",
      component: <AllOutgoing />
    },
    {
      title: "Ongoing",
      icon: <Icons.DoubleCircleDottedLineIcon />,
      component: <OngoingOutgoing />
    },
    {
      title: "Scheduled",
      icon: <Icons.CalenderIcon />,
      component: <ScheduledOutgoing />
    },
    {
      title: "Completed",
      icon: <Icons.CheckCircleIcon />,
      component: <CompletedOutgoing />
    }
  ]

  useEffect(() => {
    if (isSigned) {
      dispatch(resetTimedStatusTransactions())
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchOutgoingTransactions(originalAddress?.toString() || ""))
    }
  }, [dispatch, isSigned])

  return (
    <>
      <Breadcrumb title={`${t("outgoing-transactions")}`} />

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

export default Outgoing
