import { Button } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { toSubstring } from "utils"
import { InstantStreamOverviewProps } from "./instantStreamOverview.d"
import * as Icons from "assets/icons"
import { twMerge } from "tailwind-merge"

export const InstantStreamOverview: FC<InstantStreamOverviewProps> = ({
  formValues,
  className
}) => {
  const { t } = useTranslation("common")
  return (
    <div
      className={twMerge(
        "p-10 flex flex-col justify-center text-content-primary w-[330px]",
        className ?? ""
      )}
    >
      <div className="border-dashed border-b pb-4 border-outline">
        <h1 className="text-base font-semibold">
          {t("send:transfer-overview")}
        </h1>
      </div>
      <div className="pt-4">
        <p className="text-sm text-content-secondary">
          <span className="text-content-primary">
            {formValues?.amount || "..."} {formValues?.token || "..."}{" "}
          </span>
          {t("send:token-amount-details")}{" "}
          <span className="text-content-primary">
            {" "}
            {formValues?.receiverWallet
              ? toSubstring(formValues?.receiverWallet, 5, true)
              : "..."}
          </span>{" "}
          {t("send:in-few-seconds")}
        </p>
      </div>
      <div className="mt-12 border border-outline p-4 rounded-md">
        <div className="text-subtitle text-content-primary">
          {t("send:streaming-help")}
        </div>
        <span className="text-content-tertiary text-sm">
          {t("send:streaming-help-details")}
        </span>
        <div className="flex gap-2 mt-4">
          <Button
            variant="default"
            size="small"
            title={`${t("send:check-faq")}`}
            endIcon={<Icons.OutsideLinkIcon />}
          />
          <Button
            variant="default"
            size="small"
            title={`${t("send:join-discord")}`}
            endIcon={<Icons.OutsideLinkIcon />}
          />
        </div>
      </div>
    </div>
  )
}
