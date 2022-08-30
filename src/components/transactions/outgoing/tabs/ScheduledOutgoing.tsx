import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchScheduledTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { OutgoingTransactionTable } from "../OutgoingTransactionTable"

export const ScheduledOutgoing: FC = () => {
  const { scheduledTransactions } = useAppSelector(
    (state) => state.transactions
  )
  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  useEffect(() => {
    if (isSigned) {
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchScheduledTransactions("outgoing"))
    }
  }, [dispatch, isSigned])
  return (
    <div>
      <OutgoingTransactionTable
        fetchTransactions={fetchScheduledTransactions}
        transactions={{ ...scheduledTransactions, results: [] }}
      />
    </div>
  )
}
