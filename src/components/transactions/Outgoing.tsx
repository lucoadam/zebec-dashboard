import React, { FC, useState } from "react"
import { useTranslation } from "next-i18next"
import FilterTabs from "./FilterTabs"
import { Table, TableBody } from "components/shared"
import OutgoingTableRow from "./OutgoingTableRow"

import { outgoingTransactions } from "fakedata"

const Outgoing: FC = () => {
  const { t } = useTranslation("transactions")
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")

  const headers = [
    { label: "transactions:table.progress" },
    { label: "transactions:table.transaction-date" },
    { label: "transactions:table.receiver" },
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
    </>
  )
}

export default Outgoing
