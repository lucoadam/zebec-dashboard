import { Button } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import * as Icons from "assets/icons"
import { displayExponentialNumber, splitNumber } from "utils"

interface TreasuryVaultBalanceProps {
  balance?: number
}

export const TreasuryVaultBalance: FC<TreasuryVaultBalanceProps> = ({
  balance = 0
}) => {
  const { t } = useTranslation("treasuryOverview")
  const depositedBalance = splitNumber(balance)
  return (
    <div className="deposited-balance p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          {t("treasury-vault-balance")}
        </div>
        <Button
          size="small"
          title={`${t("transfer-to-treasury")}`}
          endIcon={<Icons.ArrowRightIcon />}
        />
      </div>
      <div>
        <div className=" text-heading-3 text-content-primary font-semibold">
          <span data-tip={displayExponentialNumber(balance)}>
            {`$${depositedBalance[0]}`}
            <span className=" text-subtitle text-content-contrast">
              .{depositedBalance[1]}
            </span>
          </span>
        </div>
        <p className="text-caption text-content-contrast mt-4">
          {t("treasury-vault-balance-detail")}
        </p>
      </div>
    </div>
  )
}
