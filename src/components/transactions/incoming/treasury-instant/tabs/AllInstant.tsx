import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchIncomingTreasuryInstantTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { InstantTransactionsTable } from "../InstantTransactionsTable"

export const AllInstant: FC = () => {
  const dispatch = useAppDispatch()
  const { incomingTreasuryInstantTransactions } = useAppSelector(
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
      dispatch(fetchIncomingTreasuryInstantTransactions("ALL"))
    }
    // eslint-disable-next-line
  }, [isSigned])

  if (!isSigned) return null
  return (
    <div>
      <InstantTransactionsTable
        fetchTransactions={() =>
          dispatch(fetchIncomingTreasuryInstantTransactions("ALL"))
        }
        transactions={incomingTreasuryInstantTransactions}
      />
    </div>
  )
}
