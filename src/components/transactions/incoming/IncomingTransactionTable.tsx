/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "app/hooks"
import { EmptyDataState, Pagination, Table, TableBody } from "components/shared"
import {
  fetchCompletedTransactions,
  fetchIncomingTransactions,
  fetchOngoingTransactions,
  fetchScheduledTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useState } from "react"
import IncomingTableRow from "./IncomingTableRow"
import { TransactionSkeleton } from "../TransactionSkeleton"
import { useTranslation } from "next-i18next"

export interface TransactionTableProps {
  transactions: {
    count: number | null
    next: string
    previous: string
    results: any[]
  }
  fetchTransactions:
    | typeof fetchIncomingTransactions
    | typeof fetchCompletedTransactions
    | typeof fetchOngoingTransactions
    | typeof fetchScheduledTransactions
}

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

export const IncomingTransactionTable: FC<TransactionTableProps> = ({
  transactions,
  fetchTransactions
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")
  const { pagination, loading } = useAppSelector((state) => state.transactions)

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("")
    else setActiveDetailsRow(index)
  }

  return (
    <>
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {loading && !transactions.results.length && (
            <tr>
              <td colSpan={headers.length}>
                <TransactionSkeleton />
              </td>
            </tr>
          )}
          {transactions.results.length === 0 && !loading ? (
            <tr>
              <td colSpan={headers.length}>
                <EmptyDataState
                  message={t("transactions:table.incoming-empty")}
                />
              </td>
            </tr>
          ) : (
            transactions.results.map((transaction, index) => {
              return (
                <IncomingTableRow
                  key={transaction.id}
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
          dispatch(fetchTransactions())
        }}
      />
    </>
  )
}
