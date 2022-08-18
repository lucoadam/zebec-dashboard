import { EmptyDataState, Table, TableBody } from "components/shared"
import { dcaTransactions } from "fakedata"
import TransactionTableRow from "./TransactionTableRow"

export const TransactionsTab = () => {
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
      {/* <Pagination pagination={pagination} setPagination={setPagination} /> */}
    </div>
  )
}
