import { useAppDispatch } from "app/hooks"
import ExportModal from "components/modals/export-report/ExportModal"
import RejectTransactionModal from "components/modals/RejectTransactionModal"
import SignTransactionModal from "components/modals/SignTransactionModal"
import { Button, Tab } from "components/shared"
import { toggleExportModal } from "features/export-report/exportSlice"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import { HistoryTransactions } from "./HistoryTransactions"
import { ScheduledTransactions } from "./ScheduledTransactions"
import { WithdrawalTransactions } from "./WithdrawalTransactions"

const transactionTabs = [
  {
    title: "Scheduled",
    count: 0,
    Component: <ScheduledTransactions />
  },
  {
    title: "History",
    count: 0,
    Component: <HistoryTransactions />
  },
  {
    title: "Withdrawals",
    count: 0,
    Component: <WithdrawalTransactions />
  }
]

export const Transactions = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")

  const [activePage, setActivePage] = useState<number>(0)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [activePage])

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-4  border-b border-outline">
        <div className="flex gap-2 items-center overflow-auto overflow-y-hidden">
          {/* Tabs */}
          {transactionTabs.map((transactionTab, index) => {
            return (
              <Tab
                className="capitalize"
                key={transactionTab.title}
                type="plain"
                title={`${transactionTab.title.toLowerCase()}`}
                isActive={activePage === index}
                count={transactionTab.count}
                onClick={() => setActivePage(index)}
              />
            )
          })}
        </div>
        <Button
          title={`${t("export-report")}`}
          onClick={() => {
            dispatch(toggleExportModal())
          }}
        />
      </div>
      <div className="py-10">
        {/* Active Tab */}
        {transactionTabs[activePage].Component}
      </div>

      {/* <Pagination pagination={pagination} setPagination={setPagination} /> */}
      <RejectTransactionModal />
      <SignTransactionModal />
      <ExportModal />
    </div>
  )
}
