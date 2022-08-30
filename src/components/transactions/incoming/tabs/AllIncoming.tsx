import { useAppSelector } from "app/hooks"
import { fetchIncomingTransactions } from "features/transactions/transactionsSlice"
import { FC } from "react"
import { IncomingTransactionTable } from "../IncomingTransactionTable"

export const AllIncoming: FC = () => {
  const { incomingTransactions } = useAppSelector((state) => state.transactions)
  return (
    <div>
      <IncomingTransactionTable
        fetchTransactions={fetchIncomingTransactions}
        transactions={incomingTransactions}
      />
    </div>
  )
}
