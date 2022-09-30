import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchIncomingTreasuryContinuousTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { TreasuryContinuousTransactionsTable } from "../TreasuryContinuousTransactionsTable"

export const TreasuryAllContinuous: FC = () => {
  const dispatch = useAppDispatch()
  const { incomingTreasuryContinuousTransactions } = useAppSelector(
    (state) => state.transactions
  )
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
      dispatch(fetchIncomingTreasuryContinuousTransactions("all"))
    }
    // eslint-disable-next-line
  }, [isSigned])

  if (!isSigned) return null
  return (
    <div>
      <TreasuryContinuousTransactionsTable
        fetchTransactions={() =>
          dispatch(fetchIncomingTreasuryContinuousTransactions("all"))
        }
        transactions={incomingTreasuryContinuousTransactions}
      />
    </div>
  )
}
