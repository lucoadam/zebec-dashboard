import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { Token } from "components/shared/Token"
import moment from "moment"
import { FC } from "react"
import { formatCurrency } from "utils"
import { getUsdBalance } from "utils/getBalance"

interface TransactionTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any
}

const TransactionTableRow: FC<TransactionTableRowProps> = ({ transaction }) => {
  // const { t } = useTranslation("dca")
  const tokensPrice = useAppSelector((state) => state.tokenDetails.prices)

  return (
    <tr className={`flex items-center`}>
      <td className="px-6 py-4 min-w-85">
        <div className="flex items-center gap-x-2.5">
          <Token symbol={transaction.symbol ?? "SOL"} />
          <div className="flex flex-col gap-y-1 text-content-contrast">
            <div className="flex items-center text-subtitle-sm font-medium">
              <span className="text-body text-content-primary font-semibold">
                {formatCurrency(
                  transaction.amount,
                  transaction.amount >= 0 ? "+" : "",
                  2
                )}
              </span>
              &nbsp;{transaction.symbol}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 min-w-61">
        <div className="text-caption text-content-primary">
          {moment(transaction.date).format("MMMM D, YYYY")}
        </div>
      </td>
      <td className="px-6 py-4 min-w-61">
        <div className="flex capitalize items-center gap-x-2.5 text-caption text-content-primary">
          {transaction.action === "buy" ? (
            <Icons.PlusIcon className="text-success" />
          ) : (
            <Icons.ArrowUpRightIcon className="text-error" />
          )}
          {transaction.action}
        </div>
      </td>
      <td className="px-6 py-4 min-w-61">
        <div className="text-caption text-content-primary">
          {formatCurrency(
            getUsdBalance(
              tokensPrice,
              [
                {
                  symbol: transaction.symbol,
                  balance: Math.abs(transaction.amount)
                }
              ],
              transaction.symbol
            ),
            "$",
            2
          )}
        </div>
      </td>
    </tr>
  )
}

export default TransactionTableRow
