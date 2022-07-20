import { FC } from "react"
import { StreamOverviewProps } from "./StreamOverview.d"
import { SupportCard } from "components/shared"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { useTranslation } from "next-i18next"

export const StreamOverview: FC<StreamOverviewProps> = ({
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
            {formValues?.tokenAmount || formValues?.amount || "..."}{" "}
            {formValues?.token || "..."}{" "}
          </span>
          {t("send:token-amount-details")}{" "}
          <span className="text-content-primary">
            {" "}
            {formValues?.receiverWallet
              ? toSubstring(formValues?.receiverWallet, 5, true)
              : "..."}
          </span>
        </p>
        {(formValues?.noOfTimes ||
          formValues?.tokenAmount ||
          formValues?.interval) && (
          <p className="text-sm text-content-secondary">
            {t("send:for")}{" "}
            <span className="text-content-primary">
              {formValues?.noOfTimes || "..."} {formValues?.interval || "..."}.{" "}
              {formValues?.amount || "..."} {formValues?.token || "..."}
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
      <SupportCard
        className="mt-12 bg-transparent p-0"
        title="send:streaming-help"
        description="send:streaming-help-details"
        buttons={[
          {
            title: "common:support.check-faq"
          },
          {
            title: "common:support.join-discord"
          }
        ]}
      />
      {/* <div className="mt-12 border border-outline p-4 rounded-md">
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
      </div> */}
    </div>
  )
}
