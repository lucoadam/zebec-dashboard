import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchTreasuryTransactions,
  setTreasuryTransactionPagination
} from "features/treasuryTransactions/treasuryTransactionsSlice"
import { FC, useEffect } from "react"
import { WithdrawlTransactionsTable } from "../WithdrawlTransactionsTable"

export const AllWithdrawl: FC = () => {
  const dispatch = useAppDispatch()
  const { transactions } = useAppSelector((state) => state.treasuryTransactions)
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const { isSigned } = useAppSelector((state) => state.common)

  useEffect(() => {
    if (isSigned && activeTreasury) {
      dispatch(
        setTreasuryTransactionPagination({
          currentPage: 1,
          limit: 10,
          total: 0
        })
      )
      dispatch(
        fetchTreasuryTransactions({
          treasury_uuid: activeTreasury.uuid
        })
      )
    }
    // eslint-disable-next-line
  }, [isSigned, activeTreasury])

  if (!activeTreasury) return null
  return (
    <div>
      <WithdrawlTransactionsTable
        fetchTransactions={() =>
          dispatch(
            fetchTreasuryTransactions({
              treasury_uuid: activeTreasury.uuid
            })
          )
        }
        transactions={transactions}
      />
    </div>
  )
}
