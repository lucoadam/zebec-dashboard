import { Button } from "components/shared"
import * as React from "react"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import moment from "moment"

export function NotificationRows() {
  const { t } = useTranslation("")
  return (
    <div>
      <div className="flex gap-x-4 border-b border-outline pb-3 pt-1">
        <div className="text-content-success pt-4">
          <Icons.Pass />
        </div>
        <div>
          <div className="text-content-success font-semibold pt-3">
            1,024.12 SOL Sent
          </div>

          <div className="text-content-secondary text-caption pt-1">
            Money has been sent successfully to 0x54....Af53
          </div>
          <div className="flex pt-2">
            <div className=" ">
              <Button
                size={"small"}
                endIcon={<Icons.OutsideLinkIcon />}
                title={`${t("common:notifications.view-on-explorer")}`}
              />
            </div>
            <div className="text-content-tertiary text-caption pl-2 pt-1">
              {moment().subtract(10, "days").calendar()}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-x-4 pb-3">
        <div className="text-content-error pt-4 ">
          <Icons.Fail />
        </div>
        <div>
          <div className="text-content-error font-semibold pt-3">
            Transaction Failed
          </div>

          <div className="text-content-secondary text-caption pt-2">
            You have insufficient balance in the vault
          </div>

          <div className="text-content-tertiary text-caption pt-2">
            {moment().subtract(10, "minutes").calendar()}
          </div>
        </div>
      </div>
    </div>
  )
}
