import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchCompletedTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { OutgoingTransactionTable } from "../OutgoingTransactionTable"

export const CompletedOutgoing: FC = () => {
  const { completedTransactions } = useAppSelector(
    (state) => state.transactions
  )
  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  useEffect(() => {
    if (isSigned) {
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchCompletedTransactions("outgoing"))
    }
  }, [dispatch, isSigned])

  return (
    <div>
      <OutgoingTransactionTable
        fetchTransactions={fetchCompletedTransactions}
        transactions={completedTransactions}
      />
    </div>
  )
}
