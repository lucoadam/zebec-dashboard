import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, EmptyDataState } from "components/shared"
import { useTranslation } from "next-i18next"
import { useEffect } from "react"
import ReactTooltip from "react-tooltip"
import { PendingConfirmationRow } from "./PendingConfirmationRow"

export const PendingConfirmation = () => {
  const { t } = useTranslation()
  const { transactions } = useAppSelector((state) => state.treasuryTransactions)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [transactions])

  return (
    <div className="p-6 rounded bg-background-secondary flex flex-col gap-y-2.5 h-full">
      <div className="flex justify-between items-center">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          {t("treasuryOverview:pending-confirmation")}
        </div>
        <Button
          size="small"
          title={`${t("common:buttons.view-all")}`}
          endIcon={<Icons.ArrowRightIcon />}
        />
      </div>
      <div className="flex flex-col">
        {transactions.results.length === 0 ? (
          <EmptyDataState
            message={t("treasuryOverview:empty")}
            className="py-14 text-center"
          />
        ) : (
          transactions.results.map((transaction) => {
            return (
              <PendingConfirmationRow
                key={transaction.uuid}
                transaction={transaction}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
