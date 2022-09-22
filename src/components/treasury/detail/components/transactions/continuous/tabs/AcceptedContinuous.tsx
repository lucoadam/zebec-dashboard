import { useAppDispatch, useAppSelector } from "app/hooks"
import { fetchTreasuryVaultContinuousTransactions } from "features/treasuryTransactions/treasuryTransactionsSlice"
import { FC, useEffect } from "react"
import { ContinuousTransactionsTable } from "../ContinuousTransactionsTable"

export const AccepteContinuous: FC = () => {
  const dispatch = useAppDispatch()
  const { vaultContinuousTransactions } = useAppSelector(
    (state) => state.treasuryTransactions
  )
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const { isSigned } = useAppSelector((state) => state.common)

  useEffect(() => {
    if (isSigned && activeTreasury) {
      dispatch(
        fetchTreasuryVaultContinuousTransactions({
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
      <ContinuousTransactionsTable
        fetchTransactions={() =>
          fetchTreasuryVaultContinuousTransactions({
            treasury_uuid: activeTreasury.uuid,
            status: "ACCEPTED"
          })
        }
        transactions={vaultContinuousTransactions}
      />
    </div>
  )
}
