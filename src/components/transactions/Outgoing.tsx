import { Breadcrumb, EmptyDataState, Table, TableBody } from "components/shared"
import { useAppSelector } from "app/hooks"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"
import FilterTabs from "./FilterTabs"
import OutgoingTableRow from "./OutgoingTableRow"
import ExportModal from "components/modals/export-report/ExportModal"

const Outgoing: FC = () => {
  const { t } = useTranslation("transactions")
  const { outgoingTransactions } = useAppSelector((state) => state.stream)
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

  return (
    <>
      <Breadcrumb title={`${t("outgoing-transactions")}`} />

      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {outgoingTransactions.length === 0 ? (
            <tr>
              <td colSpan={headers.length}>
                <EmptyDataState message="There are no outgoing transactions. The transactions you initiated will appear here." />
              </td>
            </tr>
          ) : (
            outgoingTransactions.map((transaction, index) => {
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
      <ExportModal />
    </>
  )
}

export default Outgoing
