import { useAppDispatch, useAppSelector } from "app/hooks"
import { Breadcrumb, Tab } from "components/shared"
import {
  fetchIncomingTransactions,
  resetTimedStatusTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import * as Icons from "assets/icons"
import InstantTransactions from "./treasury-instant/InstantTransactions"
import ContinuousTransactions from "./continuous/ContinuousTransactions"
import TreasuryContinuousTransactions from "./treasury-continuous/TreasuryContinuousTransactions"
import NftTransactions from "./treasury-nft/NftTransactions"

const transactionTabs = [
  {
    title: "continuous",
    count: 0,
    Component: <ContinuousTransactions />,
    icon: <Icons.DoubleCircleDottedLineIcon />
  },
  {
    title: "treasury-continuous",
    count: 0,
    Component: <TreasuryContinuousTransactions />,
    icon: <Icons.DoubleCircleDottedLineIcon />
  },
  {
    title: "treasury-instant",
    count: 0,
    Component: <InstantTransactions />,
    icon: <Icons.ThunderIcon />
  },
  {
    title: "treasury-nft",
    count: 0,
    Component: <NftTransactions />,
    icon: <Icons.SquareBlockMove />
  }
]

const Incoming: FC = () => {
  const { t } = useTranslation("transactions")
  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.common)
  const [activePage, setActivePage] = useState<number>(0)

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
      </div>
    </>
  )
}

export default Incoming
