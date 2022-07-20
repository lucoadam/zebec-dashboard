import { EmptyDataState, Table, TableBody } from "components/shared"
import { farmsData } from "fakedata"
import { useState } from "react"
import FarmsTableRow from "./FarmsTableRow"

export const Farms = () => {
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")

  const headers = [
    {
      label: "table.farm",
      width: "59.5"
    },
    {
      label: "table.pending-rewards",
      width: "39.4"
    },
    {
      label: "table.deposited",
      width: "39.4"
    },
    {
      label: "table.apy-7d",
      width: "39.4"
    },
    {
      label: "table.tvl",
      width: "39.4"
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
        {farmsData.data.length === 0 && (
          <tr>
            <td colSpan={headers.length}>
              <EmptyDataState message="There are no transactions. The payments you receive/ withdraw will appear here." />
            </td>
          </tr>
        )}
        {farmsData.data.map((liquidity, index) => {
          return (
            <FarmsTableRow
              key={index}
              index={index}
              liquidity={liquidity}
              activeDetailsRow={activeDetailsRow}
              handleToggleRow={() => handleToggleRow(index)}
            />
          )
        })}
      </TableBody>
    </Table>
  )
}
