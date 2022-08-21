import { SupportCardComponents } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { StreamOverviewProps } from "./StreamOverview.d"

export const StreamOverview: FC<StreamOverviewProps> = ({
  formValues,
  className
}) => {
  const { t } = useTranslation("common")
  return (
    <div
      className={twMerge(
        "p-10 flex flex-col justify-center text-content-primary w-[420px]",
        className ?? ""
      )}
    >
      <div className="border-dashed border-b pb-4 border-outline">
        <h1 className="text-base font-semibold">{t("send:stream-overview")}</h1>
      </div>
      <div className="pt-4">
        <p className="text-sm text-content-secondary">
          {t("send:stream-start-details")}{" "}
          <span className="text-content-primary">
            {formValues?.startDate || "..."} {formValues?.startTime || "..."}
          </span>
        </p>
        <p className="text-sm mt-2 text-content-secondary">
          <span className="text-content-primary">
            {formValues?.tokenAmount || formValues?.amount || "0"}{" "}
            {formValues?.symbol || "..."}{" "}
          </span>
          {t("send:token-amount-details")}{" "}
          <span className="text-content-primary">
            {" "}
            {formValues?.receiver ? (
              toSubstring(formValues?.receiver, 5, true)
            ) : (
              <span>receiver wallet</span>
            )}
          </span>
        </p>
        {(formValues?.noOfTimes ||
          formValues?.tokenAmount ||
          formValues?.interval) && (
          <p className="text-sm text-content-secondary">
            {t("send:for")}{" "}
            <span className="text-content-primary">
              {formValues?.noOfTimes || "..."} {formValues?.interval || "..."}.{" "}
              {formValues?.amount || "..."} {formValues?.symbol || "..."}
            </span>{" "}
            {t("send:in-total")}
          </p>
        )}
        <p className="mt-2 text-sm text-content-secondary">
          {t("send:stream-end-details")}{" "}
          <span className="text-content-primary">
            {formValues?.endDate || "..."} {formValues?.endTime || "..."}
          </span>
        </p>
      </div>
      <SupportCardComponents.ZebecHelp page="send" className="mt-12" />
    </div>
  )
}
