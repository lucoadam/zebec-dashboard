import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchOngoingTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { OutgoingTransactionTable } from "../OutgoingTransactionTable"

export const OngoingOutgoing: FC = () => {
  const { ongoingTransactions } = useAppSelector((state) => state.transactions)

  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.common)
  useEffect(() => {
    if (isSigned) {
      dispatch(setPagination({ currentPage: 1, limit: 10, total: 0 }))
      dispatch(fetchOngoingTransactions("outgoing"))
    }
  }, [dispatch, isSigned])
  return (
    <div>
      <OutgoingTransactionTable
        fetchTransactions={fetchOngoingTransactions}
        transactions={ongoingTransactions}
      />
    </div>
  )
}
