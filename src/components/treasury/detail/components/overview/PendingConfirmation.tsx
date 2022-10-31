import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, EmptyDataState } from "components/shared"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import ReactTooltip from "react-tooltip"
import { PendingConfirmationRow } from "./PendingConfirmationRow"

export const PendingConfirmation = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const { pendingTransactions } = useAppSelector(
    (state) => state.treasuryTransactions
  )

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [pendingTransactions])

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
          onClick={() =>
            router.push(`/treasury/${activeTreasury?.uuid}/#transactions`)
          }
        />
      </div>
      <div className="flex flex-col">
        {pendingTransactions.results.length === 0 ? (
          <EmptyDataState
            message={t("treasuryOverview:empty")}
            className="py-14 text-center"
          />
        ) : (
          pendingTransactions.results.map((transaction) => {
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
