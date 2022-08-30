import { useAppDispatch, useAppSelector } from "app/hooks"
import { Breadcrumb } from "components/shared"
import {
  fetchIncomingTransactions,
  resetTimedStatusTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import FilterTabs, { Tab } from "../FilterTabs"
import * as Icons from "assets/icons"
import { AllIncoming } from "./tabs/AllIncoming"
import { CompletedIncoming } from "./tabs/CompletedIncoming"
import { ScheduledIncoming } from "./tabs/ScheduledIncoming"
import { OngoingIncoming } from "./tabs/OngoingIncoming"

const Incoming: FC = () => {
  const { t } = useTranslation("transactions")
  const dispatch = useAppDispatch()
  const {
    incomingTransactions,
    completedTransactions,
    ongoingTransactions,
    scheduledTransactions
  } = useAppSelector((state) => state.transactions)
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  const [activeTab, setActiveTab] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const filterTabs: Tab[] = [
    {
      title: "All",
      count: incomingTransactions.count,
      component: <AllIncoming />
    },
    {
      title: "Ongoing",
      icon: <Icons.DoubleCircleDottedLineIcon />,
      count: ongoingTransactions.count,
      component: <OngoingIncoming />
    },
    {
      title: "Scheduled",
      icon: <Icons.CalenderIcon />,
      count: scheduledTransactions.count,
      component: <ScheduledIncoming />
    },
    {
      title: "Completed",
      icon: <Icons.CheckCircleIcon />,
      component: <CompletedIncoming />,
      count: completedTransactions.count
    }
  ]

  useEffect(() => {
    if (isSigned) {
      dispatch(resetTimedStatusTransactions())
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchIncomingTransactions())
    }
  }, [dispatch, isSigned])

  return (
    <>
      <Breadcrumb title={`${t("incoming-transactions")}`} />
      {/* Tabs */}
      <FilterTabs
        tabs={filterTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Table */}
      {filterTabs[activeTab].component}
    </>
  )
}

export default Incoming
