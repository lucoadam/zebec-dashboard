import { EmptyDataState, Pagination, Table, TableBody } from "components/shared"
import { useAppSelector } from "app/hooks"
import { FC, useState } from "react"
import { TransactionSkeleton } from "components/transactions/TransactionSkeleton"
import TreasuryContinuousTransactionsTableRow from "./TreasuryContinuousTransactionsTableRow"
import { setPagination } from "features/transactions/transactionsSlice"

export interface TransactionTableProps {
  transactions: {
    count: number | null
    next: string
    previous: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: any[]
  }
  fetchTransactions: () => void
}

export const TreasuryContinuousTransactionsTable: FC<TransactionTableProps> = ({
  transactions,
  fetchTransactions
}) => {
  const { loading, pagination } = useAppSelector((state) => state.transactions)

  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")

  const headers = [
    {
      label: "table.progress",
      width: "85"
    },
    {
      label: "table.transaction-date",
      width: "60"
    },
    {
      label: "table.sender",
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
      <Table headers={headers}>
        <TableBody>
          {loading ? (
            <tr>
              <td colSpan={headers.length}>
                <TransactionSkeleton />
              </td>
            </tr>
          ) : transactions.results.length === 0 && !loading ? (
            <tr>
              <td colSpan={headers.length}>
                <EmptyDataState message="There are no incoming transactions. The payments you receive will appear here." />
              </td>
            </tr>
          ) : (
            transactions.results.map((transaction, index) => {
              return (
                <TreasuryContinuousTransactionsTableRow
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
      {transactions.results.length > 0 && (
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          onChange={() => fetchTransactions()}
        />
      )}
    </>
  )
}
