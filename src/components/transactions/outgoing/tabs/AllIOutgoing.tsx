import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchOutgoingTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { OutgoingTransactionTable } from "../OutgoingTransactionTable"

export const AllOutgoing: FC = () => {
  const { outgoingTransactions } = useAppSelector((state) => state.transactions)
  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.common)

  useEffect(() => {
    if (isSigned) {
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchOutgoingTransactions())
    }
    // eslint-disable-next-line
  }, [isSigned])

  return (
    <div>
      <OutgoingTransactionTable
        fetchTransactions={fetchOutgoingTransactions}
        transactions={outgoingTransactions}
      />
    </div>
  )
}
