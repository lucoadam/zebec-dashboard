import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchScheduledTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { IncomingTransactionTable } from "../IncomingTransactionTable"

export const ScheduledIncoming: FC = () => {
  const { scheduledTransactions } = useAppSelector(
    (state) => state.transactions
  )
  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.common)
  useEffect(() => {
    if (isSigned && scheduledTransactions.count === null) {
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchScheduledTransactions("incoming"))
    }
  }, [dispatch, isSigned, scheduledTransactions.count])
  return (
    <div>
      <IncomingTransactionTable
        fetchTransactions={fetchScheduledTransactions}
        transactions={scheduledTransactions}
      />
    </div>
  )
}
