import { useTranslation } from "next-i18next"
import * as React from "react"
import * as Icons from "assets/icons"
import { IconButton, Toggle } from "components/shared"
import Link from "next/link"
import { NotificationRows } from "./NotificationRows"
import { NotificationProps } from "./NotificationsDropdown"


  return (
    <div className=" p-5">
      <div className="flex items-center">
        <div className="text-content-primary text-subtitle font-semibold">
          {t("common:notifications.notifications")}
        </div>
        <div className="gap-x-2 ml-auto text-content-primary flex items-center">
          <div className="">
            <Link href="/notifications">
              <>
                <Icons.GearringAltIcon />
              </>
            </Link>
          </div>
          <div>
            <Toggle
              text={t("common:notifications.only-show-unread")}
              onChange={() => setEarlier(!earlier)}
            />
          </div>

          <div className="">
            <IconButton
              className="top-1 "
              icon={<Icons.CrossIcon />}
              onClick={() => {
                handleNotificationClose()
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex text-content-primary pt-6">
          <div className="text-subtitle font-semibold">
            {t("common:notifications.new")}
          </div>
          <div className=" text-caption ml-auto rounded-lg justify-center items-center p-1 flex border border-outline gap-x-1 ">
            <div>
              <Icons.CheckIcon />
            </div>
            <div className="text-content-primary">
              {t("common:notifications.mark-all-as-read")}
            </div>
          </div>
        </div>
        <div>
          <NotificationRows />
        </div>
        {earlier && (
          <div className="pt-6 border-t border-outline">
            <div className="text-subtitle font-semibold text-content-primary">
              {t("common:notifications.earlier")}
            </div>
            <div>
              <NotificationRows />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
