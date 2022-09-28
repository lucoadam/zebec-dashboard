import { SupportCardComponents } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { InstantStreamOverviewProps } from "./InstantStreamOverview.d"

export const InstantStreamOverview: FC<InstantStreamOverviewProps> = ({
  formValues,
  className
}) => {
  const { t } = useTranslation("common")
  return (
    <div
      className={twMerge(
        "p-10 flex flex-col justify-center text-content-primary w-[432px]",
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
            {formValues?.amount || "..."} {formValues?.symbol || "..."}{" "}
          </span>
          {t("send:token-amount-details")}{" "}
          <span className="text-content-primary">
            {" "}
            {formValues?.receiver ? (
              toSubstring(formValues?.receiver, 5, true)
            ) : (
              <span>{t("send:overview-receiver-wallet")}</span>
            )}
          </span>{" "}
          {t("send:once-approved")}
        </p>
      </div>
      <SupportCardComponents.ZebecHelp page="send" className="mt-12" />
    </div>
  )
}
