import { useAppDispatch, useAppSelector } from "app/hooks"
import { fetchTreasuryVaultInstantTransactions } from "features/treasuryTransactions/treasuryTransactionsSlice"
import { FC, useEffect } from "react"
import { InstantTransactionsTable } from "../InstantTransactionsTable"

export const PendingInstant: FC = () => {
  const dispatch = useAppDispatch()
  const { vaultInstantTransactions } = useAppSelector(
    (state) => state.treasuryTransactions
  )
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const { isSigned } = useAppSelector((state) => state.common)

  useEffect(() => {
    if (isSigned && activeTreasury) {
      dispatch(
        fetchTreasuryVaultInstantTransactions({
          treasury_uuid: activeTreasury.uuid,
          status: "PENDING"
        })
      )
    }
    // eslint-disable-next-line
  }, [isSigned, activeTreasury])

  if (!activeTreasury) return null
  return (
    <div>
      <InstantTransactionsTable
        fetchTransactions={() =>
          fetchTreasuryVaultInstantTransactions({
            treasury_uuid: activeTreasury.uuid,
            status: "PENDING"
          })
        }
        transactions={vaultInstantTransactions}
      />
    </div>
  )
}
