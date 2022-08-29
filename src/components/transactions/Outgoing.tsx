import {
  Breadcrumb,
  EmptyDataState,
  Pagination,
  Table,
  TableBody
} from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import FilterTabs from "./FilterTabs"
import OutgoingTableRow from "./OutgoingTableRow"
import ExportModal from "components/modals/export-report/ExportModal"
// import { useWallet } from "@solana/wallet-adapter-react"
import {
  fetchOutgoingTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { TransactionSkeleton } from "./TransactionSkeleton"

const Outgoing: FC = () => {
  const { t } = useTranslation("transactions")
  // const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const { outgoingTransactions, pagination, loading } = useAppSelector(
    (state) => state.transactions
  )
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")

  const headers = [
    { label: "transactions:table.progress", width: "85" },
    { label: "transactions:table.transaction-date", width: "61" },
    { label: "transactions:table.receiver", width: "61" },
    { label: "" }
  ]

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("")
    else setActiveDetailsRow(index)
  }

  useEffect(() => {
    if (isSigned) {
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchOutgoingTransactions())
    }
  }, [dispatch, isSigned])

  return (
    <>
      <Breadcrumb title={`${t("outgoing-transactions")}`} />

      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {loading && !outgoingTransactions.results.length && (
            <tr>
              <td colSpan={headers.length}>
                <TransactionSkeleton />
              </td>
            </tr>
          )}
          {outgoingTransactions.results.length === 0 && !loading ? (
            <tr>
              <td colSpan={headers.length}>
                <EmptyDataState message="There are no outgoing transactions. The transactions you received will appear here." />
              </td>
            </tr>
          ) : (
            outgoingTransactions.results.map((transaction, index) => {
              return (
                <OutgoingTableRow
                  key={index}
                  index={index}
                  transaction={transaction}
                  activeDetailsRow={activeDetailsRow}
                  handleToggleRow={() => handleToggleRow(index)}
                />
              )
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        setPagination={setPagination}
        onChange={() => {
          dispatch(fetchOutgoingTransactions())
        }}
      />

      <ExportModal />
    </>
  )
}

export default Outgoing
