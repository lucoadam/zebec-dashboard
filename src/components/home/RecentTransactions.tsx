import { useWallet } from "@solana/wallet-adapter-react"
import * as Icons from "assets/icons"
import {
  Button,
  CircularProgress,
  EmptyDataState,
  TableBody,
  TransactionStatus
} from "components/shared"
import { recentTransactions } from "fakedata"
import { FC } from "react"

const getValidTokenAmount = (amount: number) => {
  if (amount > 0) {
    return amount
  }
  return 0
}

const RecentTransactions: FC = () => {
  const walletObject = useWallet()
  return (
    <>
      <div className="lg:col-span-2 p-6 rounded bg-background-secondary flex flex-col gap-y-6 h-96">
        <div className="flex justify-between items-center">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            RECENT TRANSACTIONS
          </div>
          <Button
            size="small"
            title="View All"
            endIcon={<Icons.ArrowRightIcon />}
          />
        </div>
        {recentTransactions.data.length === 0 && (
          <EmptyDataState message="There are no recent transactions. The recent payments you make and receive will appear here." />
        )}
        <table className="w-full whitespace-nowrap">
          <TableBody className="px-0 py-0">
            {recentTransactions.data.map((transaction) => (
              <tr key={transaction._id.$oid ?? ""}>
                <td className=" py-5 min-w-60">
                  <div className="flex items-center gap-x-2.5">
                    <div className=" w-6 h-6 grid place-content-center bg-outline-icon rounded">
                      {walletObject?.publicKey?.toString() ===
                      transaction?.sender ? (
                        <Icons.OutgoingIcon className="w-5 h-5" />
                      ) : (
                        <Icons.IncomingIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col gap-y-1 text-content-contrast">
                      <div className="text-subtitle text-content-primary font-semibold">
                        {transaction?.transaction_name}
                      </div>
                      <div className="text-caption">{transaction?.remark}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 min-w-70">
                  <div className="flex items-center gap-x-2.5">
                    <div className=" w-14 h-14">
                      <CircularProgress
                        status={transaction.status as TransactionStatus}
                        percentage={
                          (getValidTokenAmount(transaction.sent_token) * 100) /
                          transaction.amount
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-y-1 text-content-contrast">
                      <div className="flex items-center text-subtitle-sm font-medium">
                        <span className="text-subtitle text-content-primary font-semibold">
                          +48,556.98
                        </span>
                        &nbsp;SOL
                      </div>
                      <div className="text-caption">
                        48,556.98 of 1,00,00,000 {transaction.token}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </TableBody>
        </table>
      </div>
    </>
  )
}

export default RecentTransactions
