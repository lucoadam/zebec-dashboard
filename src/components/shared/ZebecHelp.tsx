import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { Button } from "./Button"

export const ZebecHelp: FC<{
  isTreasury?: boolean
}> = ({ isTreasury = false }) => {
  const { t } = useTranslation()
  return (
    <div className="w-full rounded-[4px] bg-background-secondary px-6 py-6">
      <p className="leading-6 text-base font-semibold text-content-primary mb-[8px]">
        {t(isTreasury ? "treasuryOverview:treasury-help" : "common:zebec-help")}
      </p>
      <p className="leading-5 text-sm font-normal text-content-contrast">
        {t("treasuryOverview:treasury-help-description")}
      </p>
      <div className="flex">
        <Button
          size="small"
          className="mt-[21px] mr-[8px]"
          title={t("treasuryOverview:check-faq")}
          endIcon={<Icons.OutsideLinkIcon className="text-content-contrast" />}
        />
        <Button
          size="small"
          className="mt-[21px]"
          title={t("treasuryOverview:join-discord")}
          endIcon={<Icons.OutsideLinkIcon className="text-content-contrast" />}
        />
      </div>
    </div>
  )
}
