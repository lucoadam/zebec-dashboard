import { useAppDispatch, useAppSelector } from "app/hooks"
import { fetchTreasuryTransactions } from "features/treasuryTransactions/treasuryTransactionsSlice"
import { FC, useEffect } from "react"
import { WithdrawlTransactionsTable } from "../WithdrawlTransactionsTable"

export const AcceptedWithdrawl: FC = () => {
  const { transactions } = useAppSelector((state) => state.treasuryTransactions)
  const dispatch = useAppDispatch()
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const { isSigned } = useAppSelector((state) => state.common)

  useEffect(() => {
    if (isSigned && activeTreasury) {
      dispatch(
        fetchTreasuryTransactions({
          treasury_uuid: activeTreasury.uuid,
          status: "ACCEPTED"
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
          fetchTreasuryTransactions({
            treasury_uuid: activeTreasury.uuid,
            status: "ACCEPTED"
          })
        }
        transactions={transactions}
      />
    </div>
  )
}
