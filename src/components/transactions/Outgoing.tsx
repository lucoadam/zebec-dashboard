import { Table, TableBody } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"
import FilterTabs from "./FilterTabs"
import OutgoingTableRow from "./OutgoingTableRow"

import ExportModal from "components/modal/export-report/ExportModal"
import { outgoingTransactions } from "fakedata"

const Outgoing: FC = () => {
  const { t } = useTranslation("transactions")
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
      <h4 className="px-3.5 pb-6 text-heading-4 font-semibold text-content-primary">
        {t("outgoing-transactions")}
      </h4>
      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {outgoingTransactions.data.map((transaction, index) => {
            return (
              <OutgoingTableRow
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
      <ExportModal />
    </>
  )
}

export default Outgoing
