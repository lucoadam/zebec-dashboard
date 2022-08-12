import { Token } from "components/shared/Token"
import { useTranslation } from "next-i18next"
import { displayExponentialNumber } from "utils"

export const Balances = () => {
  const { t } = useTranslation()
  return (
    <div className="p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          {t("common:balances.deposited-balance")}
        </div>
        <div>
          <div className=" text-heading-3 text-content-primary font-semibold">
            <span data-tip={displayExponentialNumber(23242)}>$24234.23</span>
          </div>
        </div>
        <div className="text-caption flex items-center gap-x-1 text-content-contrast">
          <Token symbol="SOL" className="w-4 h-4" />
          120,023.23 SOL
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          AVAILABLE DEPOSITED BALANCE
        </div>
        <div>
          <div className=" text-heading-3 text-content-primary font-semibold">
            <span data-tip={displayExponentialNumber(23242)}>$24234.23</span>
          </div>
        </div>
        <div className="text-caption flex items-center gap-x-1 text-content-contrast">
          <Token symbol="USDC" className="w-4 h-4" />
          120,023.23 USDC
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          TOTAL DEPOSITED
        </div>
        <div>
          <div className=" text-heading-3 text-content-primary font-semibold">
            <span data-tip={displayExponentialNumber(23242)}>$24234.23</span>
          </div>
        </div>
        <div className="text-caption flex items-center gap-x-1 text-content-contrast">
          <Token symbol="USDC" className="w-4 h-4" />
          120,023.23 USDC
        </div>
      </div>
    </div>
  )
}
