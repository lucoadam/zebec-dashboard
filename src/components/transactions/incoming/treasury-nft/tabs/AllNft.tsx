import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  fetchIncomingTreasuryNftTransactions,
  setPagination
} from "features/transactions/transactionsSlice"
import { FC, useEffect } from "react"
import { NftTransactionsTable } from "../NftTransactionsTable"

export const AllNft: FC = () => {
  const dispatch = useAppDispatch()
  const { incomingTreasuryNftTransactions } = useAppSelector(
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
      dispatch(fetchIncomingTreasuryNftTransactions("ALL"))
    }
    // eslint-disable-next-line
  }, [isSigned])

  if (!isSigned) return null
  return (
    <div>
      <NftTransactionsTable
        fetchTransactions={() =>
          dispatch(fetchIncomingTreasuryNftTransactions("ALL"))
        }
        transactions={incomingTreasuryNftTransactions}
      />
    </div>
  )
}
