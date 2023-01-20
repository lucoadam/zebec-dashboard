import { EmptyDataState, Pagination, Table, TableBody } from "components/shared"
import { useAppSelector } from "app/hooks"
import { FC, useState } from "react"
import { TransactionSkeleton } from "components/transactions/TransactionSkeleton"
import WithdrawlTransactionsTableRow from "./WithdrawlTransactionsTableRow"
import { setTreasuryTransactionPagination } from "features/treasuryTransactions/treasuryTransactionsSlice"
import { useTranslation } from "next-i18next"

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

export const WithdrawlTransactionsTable: FC<TransactionTableProps> = ({
  transactions,
  fetchTransactions
}) => {
  const { t } = useTranslation()
  const { loading, pagination } = useAppSelector(
    (state) => state.treasuryTransactions
  )

  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")

  const headers = [
    {
      label: "table.progress",
      width: "85"
    },
    {
      label: "table.details",
      width: "50"
    },
    {
      label: "table.initiated",
      width: "33.5"
    },
    {
      label: "table.receiver",
      width: "50"
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
                  message={t(
                    "transactions:table.treasury-deposit-withdrawls-empty"
                  )}
                />
              </td>
            </tr>
          ) : (
            transactions.results.map((transaction, index) => {
              return (
                <WithdrawlTransactionsTableRow
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
          setPagination={setTreasuryTransactionPagination}
          onChange={() => fetchTransactions()}
        />
      )}
    </>
  )
}
