import { EmptyDataState, Table, TableBody } from "components/shared"
import { scheduledTransactions } from "fakedata"
import { useState } from "react"
import ScheduledTableRow from "./ScheduledTableRow"

export const ScheduledTransactions = () => {
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")

  const headers = [
    {
      label: "table.progress",
      width: "85"
    },
    {
      label: "table.transaction-date",
      width: "50"
    },
    {
      label: "table.initiated",
      width: "134px"
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
    <Table headers={headers}>
      <TableBody>
        {scheduledTransactions.data.length === 0 && (
          <tr>
            <td colSpan={headers.length}>
              <EmptyDataState message="There are no incoming transactions. The payments you receive will appear here." />
            </td>
          </tr>
        )}
        {scheduledTransactions.data.map((transaction, index) => {
          return (
            <ScheduledTableRow
              key={index}
              index={index}
              transaction={transaction}
              activeDetailsRow={activeDetailsRow}
              handleToggleRow={() => handleToggleRow(index)}
            />
          )
        })}
      </TableBody>
    </Table>
  )
}
