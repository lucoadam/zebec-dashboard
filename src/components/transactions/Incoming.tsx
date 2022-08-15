import { useAppDispatch, useAppSelector } from "app/hooks"
import ExportModal from "components/modals/export-report/ExportModal"
import {
  Breadcrumb,
  EmptyDataState,
  Pagination,
  RowsPerPage,
  Table,
  TableBody
} from "components/shared"
import {
  fetchIncomingTransactions,
  setIncomingCurrentPage,
  setLimit
} from "features/transactions/transactionsSlice"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"
import FilterTabs from "./FilterTabs"
import IncomingTableRow from "./IncomingTableRow"
import { TransactionSkeleton } from "./TransactionSkeleton"

const Incoming: FC = () => {
  const noOfOptions = [10, 20, 30, 40]
  const { t } = useTranslation("transactions")
  const dispatch = useAppDispatch()
  const { incomingTransactions, limit, loading } = useAppSelector(
    (state) => state.transactions
  )

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

  return (
    <>
      <Breadcrumb title={`${t("incoming-transactions")}`} />
      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {loading && !incomingTransactions.results.length && (
            <TransactionSkeleton />
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
      <div className="flex pt-5">
        <RowsPerPage
          noOfRows={limit}
          noOfOptions={noOfOptions}
          onChange={(noOfRows) => dispatch(setLimit(noOfRows))}
        />
        <div className="ml-auto">
          <Pagination
            pages={Math.ceil(incomingTransactions.count / limit)}
            onChange={(page: number) => {
              dispatch(setIncomingCurrentPage(page))
              dispatch(fetchIncomingTransactions())
            }}
          />
        </div>
      </div>
      <ExportModal />
    </>
  )
}

export default Incoming
