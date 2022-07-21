import { Breadcrumb, Table, TableBody } from "components/shared"
import { Pagination, RowsPerPage } from "components/shared"
import { incomingTransactions } from "fakedata"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"
import FilterTabs from "./FilterTabs"
import IncomingTableRow from "./IncomingTableRow"
import ExportModal from "components/modals/export-report/ExportModal"

const Incoming: FC = () => {
  const { t } = useTranslation("transactions")

  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)
  const [noOfRows, setNoOfRows] = useState(10)
  const noOfOptions = [10, 20, 30, 40]

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

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("")
    else setActiveDetailsRow(index)
  }

  return (
    <>
      <Breadcrumb title={`${t("incoming-transactions")}`} />
      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {incomingTransactions.data.map((transaction, index) => {
            return (
              <IncomingTableRow
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
      <div className="flex text-caption pt-5">
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

      <ExportModal />
    </>
  )
}

export default Incoming
