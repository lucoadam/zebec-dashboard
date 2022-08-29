import { useAppDispatch, useAppSelector } from "app/hooks"
import ExportModal from "components/modals/export-report/ExportModal"
import {
  Breadcrumb,
  EmptyDataState,
  Pagination,
  Table,
  TableBody
} from "components/shared"
import {
  fetchIncomingTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import FilterTabs from "./FilterTabs"
import IncomingTableRow from "./IncomingTableRow"
import { TransactionSkeleton } from "./TransactionSkeleton"

const Incoming: FC = () => {
  const { t } = useTranslation("transactions")
  const dispatch = useAppDispatch()
  const { incomingTransactions, pagination, loading } = useAppSelector(
    (state) => state.transactions
  )
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const headers = [
    {
      label: "transactions:table.progress",
      width: "85"
    },
    {
      label: "transactions:table.transaction-date",
      width: "60"
    },
    {
      label: "transactions:table.sender",
      width: "60"
    },
    {
      label: ""
    }
  ]

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("")
    else setActiveDetailsRow(index)
  }

  useEffect(() => {
    if (isSigned) {
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchIncomingTransactions())
    }
  }, [dispatch, isSigned])

  return (
    <>
      <Breadcrumb title={`${t("incoming-transactions")}`} />
      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {loading && !incomingTransactions.results.length && (
            <tr>
              <td colSpan={headers.length}>
                <TransactionSkeleton />
              </td>
            </tr>
          )}
          {incomingTransactions.results.length === 0 && !loading ? (
            <tr>
              <td colSpan={headers.length}>
                <EmptyDataState message="There are no incoming transactions. The transactions sender initiated will appear here." />
              </td>
            </tr>
          ) : (
            incomingTransactions.results.map((transaction, index) => {
              return (
                <IncomingTableRow
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
      <Pagination
        pagination={pagination}
        setPagination={setPagination}
        onChange={() => {
          dispatch(fetchIncomingTransactions())
        }}
      />
      <ExportModal />
    </>
  )
}

export default Incoming
