/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, EmptyDataState, TableBody } from "components/shared"
import { fetchRecentTransactions } from "features/transactions/transactionsSlice"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { RecentTransactionRow } from "./RecentTransactionRow"

const RecentTransactions: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  const recentTransactions = useAppSelector(
    (state) => state.transactions.recentTransactions
  )

  useEffect(() => {
    if (isSigned) {
      recentTransactions.results.length === 0 &&
        dispatch(fetchRecentTransactions())
    }
  }, [isSigned])

  return (
    <>
      <div
        className={twMerge(
          `recent-transactions md:col-span-2 p-6 rounded bg-background-secondary flex flex-col gap-y-6 h-96 overflow-hidden`,
          className
        )}
      >
        <div className="flex justify-between items-center">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            {t("home:recent.title")}
          </div>
          <Button
            size="small"
            title={`${t("common:buttons.view-all")}`}
            endIcon={<Icons.ArrowRightIcon />}
            onClick={() => {
              router.push("/transactions")
            }}
          />
        </div>
        {recentTransactions.results.length === 0 ? (
          <EmptyDataState message={t("home:recent.empty")} className="py-10" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <TableBody className="px-0 py-0 border-collapse">
                {recentTransactions.results.map((transaction: any) => (
                  <RecentTransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </TableBody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default RecentTransactions
