import {
  Breadcrumb,
  EmptyDataState,
  Pagination,
  RowsPerPage,
  Table,
  TableBody
} from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { useTranslation } from "next-i18next"
import { FC, useState, useEffect } from "react"
import FilterTabs from "./FilterTabs"
import OutgoingTableRow from "./OutgoingTableRow"
import ExportModal from "components/modals/export-report/ExportModal"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  fetchOutgoingTransactions,
  setLimit,
  setOutgoingCurrentPage
} from "features/transactions/transactionsSlice"

const Outgoing: FC = () => {
  const { t } = useTranslation("transactions")
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const { outgoingTransactions, limit, outgoingTotal } = useAppSelector(
    (state) => state.transactions
  )

  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const noOfOptions = [10, 20, 30, 40]

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

  useEffect(() => {
    if (publicKey) {
      dispatch(fetchOutgoingTransactions(publicKey?.toString()))
    }
  }, [publicKey, dispatch])

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

      {/* Pagination */}
      <div className="flex justify-between text-caption pt-5">
        <RowsPerPage
          noOfRows={limit}
          noOfOptions={noOfOptions}
          onChange={(noOfRows) => dispatch(setLimit(noOfRows))}
        />
        <Pagination
          pages={Math.ceil(outgoingTotal / limit)}
          onChange={(page: number) => {
            dispatch(setOutgoingCurrentPage(page))
            dispatch(fetchOutgoingTransactions())
          }}
        />
      </div>

      <ExportModal />
    </>
  )
}

export default Outgoing
