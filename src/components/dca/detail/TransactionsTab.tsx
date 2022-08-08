import {
  EmptyDataState,
  Pagination,
  RowsPerPage,
  Table,
  TableBody
} from "components/shared"
import { dcaTransactions } from "fakedata"
import { useState } from "react"
import TransactionTableRow from "./TransactionTableRow"

export const TransactionsTab = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)
  const [noOfRows, setNoOfRows] = useState(10)
  const noOfOptions = [10, 20, 30, 40]
  const headers = [
    {
      label: "dca:table.quantity"
      // width: "85"
    },
    {
      label: "dca:table.transaction-date"
      // width: "61"
    },
    {
      label: "dca:table.action"
      // width: "61"
    },
    {
      label: "dca:table.value"
      // width: "61"
    }
  ]
  return (
    <div>
      <Table headers={headers}>
        <TableBody>
          {dcaTransactions.data.length === 0 && (
            <tr>
              <td colSpan={headers.length}>
                <EmptyDataState message="There are no transactions. The payments you receive/ withdraw will appear here." />
              </td>
            </tr>
          )}
          {dcaTransactions.data.map((transaction, index) => {
            return (
              <TransactionTableRow
                key={index}
                index={index}
                transaction={transaction}
              />
            )
          })}
        </TableBody>
      </Table>
      <div className="flex text-caption justify-between pt-5">
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
