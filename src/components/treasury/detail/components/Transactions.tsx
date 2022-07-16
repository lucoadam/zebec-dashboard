import { Tab } from "components/shared"
import { Pagination } from "components/shared/Pagination"
import { RowsPerPage } from "components/shared/RowsPerPage"
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
  const [activePage, setActivePage] = useState<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)
  const [noOfRows, setNoOfRows] = useState(10)
  const noOfOptions = [10, 20, 30, 40]

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [activePage])

  return (
    <div className="w-full">
      <div className="flex justify-start border-b border-outline">
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
      <div className="py-10">
        {/* Active Tab */}
        {transactionTabs[activePage].Component}
      </div>
      <div className="flex text-caption pt-5">
        <RowsPerPage
          setNoOfRows={setNoOfRows}
          noOfRows={noOfRows}
          noOfOptions={noOfOptions}
        />
        <Pagination
          pages={100}
          setCurrentPage={setCurrentPage}
          setNoOfRows={setNoOfRows}
        />
      </div>
    </div>
  )
}
