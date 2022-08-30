import { useAppSelector } from "app/hooks"
import { fetchOutgoingTransactions } from "features/transactions/transactionsSlice"
import { FC } from "react"
import { OutgoingTransactionTable } from "../OutgoingTransactionTable"

export const AllOutgoing: FC = () => {
  const { outgoingTransactions } = useAppSelector((state) => state.transactions)
  return (
    <div>
      <OutgoingTransactionTable
        fetchTransactions={fetchOutgoingTransactions}
        transactions={outgoingTransactions}
      />
    </div>
  )
}
