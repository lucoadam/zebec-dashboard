import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchTreasuryVaultInstantTransactions,
  setTreasuryTransactionPagination
} from "features/treasuryTransactions/treasuryTransactionsSlice"
import { FC, useEffect } from "react"
import { InstantTransactionsTable } from "../InstantTransactionsTable"

export const AllInstant: FC = () => {
  const dispatch = useAppDispatch()
  const { vaultInstantTransactions } = useAppSelector(
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
        fetchTreasuryVaultInstantTransactions({
          treasury_uuid: activeTreasury.uuid
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
          dispatch(
            fetchTreasuryVaultInstantTransactions({
              treasury_uuid: activeTreasury.uuid
            })
          )
        }
        transactions={vaultInstantTransactions}
      />
    </div>
  )
}
