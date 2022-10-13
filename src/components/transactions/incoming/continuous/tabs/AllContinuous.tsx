import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchIncomingTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { ContinuousTransactionsTable } from "../ContinuousTransactionsTable"

export const AllContinuous: FC = () => {
  const dispatch = useAppDispatch()
  const { incomingTransactions } = useAppSelector((state) => state.transactions)
  const { isSigned } = useAppSelector((state) => state.common)

  useEffect(() => {
    if (isSigned) {
      dispatch(
        setPagination({
          currentPage: 1,
          limit: 10,
          total: 0
        })
      )
      dispatch(fetchIncomingTransactions("all"))
    }
    // eslint-disable-next-line
  }, [isSigned])

  if (!isSigned) return null
  return (
    <div>
      <ContinuousTransactionsTable
        fetchTransactions={() => dispatch(fetchIncomingTransactions("all"))}
        transactions={incomingTransactions}
      />
    </div>
  )
}
