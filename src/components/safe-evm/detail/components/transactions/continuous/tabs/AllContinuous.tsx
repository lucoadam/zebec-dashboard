import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchTreasuryVaultContinuousTransactions,
  setTreasuryTransactionPagination
} from "features/treasuryTransactions/treasuryTransactionsSlice"
import { FC, useEffect } from "react"
import { ContinuousTransactionsTable } from "../ContinuousTransactionsTable"

export const AllContinuous: FC = () => {
  const dispatch = useAppDispatch()
  const { vaultContinuousTransactions } = useAppSelector(
    (state) => state.treasuryTransactions
  )
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
        fetchTreasuryVaultContinuousTransactions({
          treasury_uuid: activeTreasury.uuid
        })
      )
    }
    // eslint-disable-next-line
  }, [isSigned, activeTreasury])

  if (!activeTreasury) return null
  return (
    <div>
      <ContinuousTransactionsTable
        fetchTransactions={() =>
          dispatch(
            fetchTreasuryVaultContinuousTransactions({
              treasury_uuid: activeTreasury.uuid
            })
          )
        }
        transactions={vaultContinuousTransactions}
      />
    </div>
  )
}
