import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchOngoingTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { IncomingTransactionTable } from "../IncomingTransactionTable"

export const OngoingIncoming: FC = () => {
  const { ongoingTransactions } = useAppSelector((state) => state.transactions)

  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.common)
  useEffect(() => {
    if (isSigned && ongoingTransactions.count === null) {
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchOngoingTransactions("incoming"))
    }
  }, [dispatch, isSigned, ongoingTransactions.count])
  return (
    <div>
      <IncomingTransactionTable
        fetchTransactions={fetchOngoingTransactions}
        transactions={ongoingTransactions}
      />
    </div>
  )
}
