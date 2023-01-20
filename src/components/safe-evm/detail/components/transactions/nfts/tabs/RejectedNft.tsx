import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchTreasuryNftTransactions,
  setTreasuryTransactionPagination
} from "features/treasuryTransactions/treasuryTransactionsSlice"
import { FC, useEffect } from "react"
import { NftTransactionsTable } from "../NftTransactionsTable"

export const RejectedNft: FC = () => {
  const { nftTransactions } = useAppSelector(
    (state) => state.treasuryTransactions
  )
  const dispatch = useAppDispatch()
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
        fetchTreasuryNftTransactions({
          treasury_uuid: activeTreasury.uuid,
          status: "REJECTED"
        })
      )
    }
    // eslint-disable-next-line
  }, [isSigned, activeTreasury])

  if (!activeTreasury) return null
  return (
    <div>
      <NftTransactionsTable
        fetchTransactions={() =>
          dispatch(
            fetchTreasuryNftTransactions({
              treasury_uuid: activeTreasury.uuid,
              status: "REJECTED"
            })
          )
        }
        transactions={nftTransactions}
      />
    </div>
  )
}
