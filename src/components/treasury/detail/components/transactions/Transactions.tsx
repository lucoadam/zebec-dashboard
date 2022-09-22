import ExportModal from "components/modals/export-report/ExportModal"
import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import ContinuousTransactions from "./continuous/ContinuousTransactions"
import InstantTransactions from "./instant/InstantTransactions"
// import { WithdrawalTransactions } from "../WithdrawalTransactions"
import WithdrawlTransactions from "./withdrawls/WithdrawlTransactions"
import * as Icons from "assets/icons"

const transactionTabs = [
  {
    title: "instant",
    count: 0,
    Component: <InstantTransactions />,
    icon: <Icons.ThunderIcon />
  },
  {
    title: "continuous",
    count: 0,
    Component: <ContinuousTransactions />,
    icon: <Icons.DoubleCircleDottedLineIcon />
  },
  {
    title: "withdrawals",
    count: 0,
    Component: <WithdrawlTransactions />,
    icon: <Icons.SwapArrowHorizontalIcon />
  }
  // {
  //   title: "nfts",
  //   count: 0,
  //   Component: <WithdrawalTransactions />,
  //   icon: <Icons.SquareBlockMove />
  // }
]

export const Transactions = () => {
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
                title={`${t(transactionTab.title)}`}
                isActive={activePage === index}
                count={transactionTab.count}
                onClick={() => setActivePage(index)}
                startIcon={transactionTab.icon}
              />
            )
          })}
        </div>
      </div>
      <div className="pt-6 pb-10">
        {/* Active Tab */}
        {transactionTabs[activePage].Component}
      </div>

      {/* <Pagination pagination={pagination} setPagination={setPagination} /> */}
      <ExportModal />
    </div>
  )
}
