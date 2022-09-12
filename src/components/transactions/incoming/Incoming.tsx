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
  const { isSigned } = useAppSelector((state) => state.common)
  const [activeTab, setActiveTab] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const filterTabs: Tab[] = [
    {
      title: "All",
      component: <AllIncoming />
    },
    {
      title: "Ongoing",
      icon: <Icons.DoubleCircleDottedLineIcon />,
      component: <OngoingIncoming />
    },
    {
      title: "Scheduled",
      icon: <Icons.CalenderIcon />,
      component: <ScheduledIncoming />
    },
    {
      title: "Completed",
      icon: <Icons.CheckCircleIcon />,
      component: <CompletedIncoming />
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
