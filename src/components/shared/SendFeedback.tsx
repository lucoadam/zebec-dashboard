import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { Button } from "./Button"

export const SendFeedback = () => {
  const { t } = useTranslation()
  return (
    <div className="w-full rounded-[4px] bg-background-secondary px-6 pt-6 pb-7">
      <p className="leading-6 text-base font-semibold text-content-primary mb-2">
        {t(`treasuryOverview:send-feedback`)}
      </p>
      <p className="leading-5 text-sm font-normal text-content-contrast">
        {t("treasuryOverview:feedback-description")}
      </p>
      <div className="flex">
        <Button
          size="small"
          className="mt-[21px]"
          title={`${t("treasuryOverview:send-us-message")}`}
          endIcon={<Icons.OutsideLinkIcon className="text-content-contrast" />}
        />
      </div>
    </div>
  )
}
