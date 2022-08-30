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

const Outgoing: FC = () => {
  const { t } = useTranslation("transactions")
  // const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const {
    outgoingTransactions,
    ongoingTransactions,
    scheduledTransactions,
    completedTransactions
  } = useAppSelector((state) => state.transactions)
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  const [activeTab, setActiveTab] = useState(0)

  const tabs: Tab[] = [
    {
      title: "All",
      count: outgoingTransactions.count,
      component: <AllOutgoing />
    },
    {
      title: "Ongoing",
      icon: <Icons.DoubleCircleDottedLineIcon />,
      count: ongoingTransactions.count,
      component: <OngoingOutgoing />
    },
    {
      title: "Scheduled",
      icon: <Icons.CalenderIcon />,
      count: scheduledTransactions.count,
      component: <ScheduledOutgoing />
    },
    {
      title: "Completed",
      icon: <Icons.CheckCircleIcon />,
      component: <CompletedOutgoing />,
      count: completedTransactions.count
    }
  ]

  useEffect(() => {
    if (isSigned) {
      dispatch(resetTimedStatusTransactions())
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchOutgoingTransactions())
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
