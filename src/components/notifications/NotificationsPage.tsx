import React from "react"

import * as Icons from "assets/icons"

import { useTranslation } from "next-i18next"
import { Button } from "components/shared"
import { NotificationFormComponent } from "./NotificationFormComponent"

export default function NotificationsComponent() {
  const { t } = useTranslation("")
  const [userNotification, setUserNotification] = React.useState<Notification>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setUserNotification(data)
  }

  return (
    <>
      <div className="container w-full  ">
        <div className="flex justify-between items-center pb-4">
          <h4 className="text-heading-4 font-semibold text-content-primary pl-10 pt-10">
            {`${t("notifications.notification")} `}
          </h4>
        </div>
        <div className="rounded bg-background-secondary p-10 mt-12 max-w-96">
          <div className="text-subtitle text-content-primary font-semibold">{`${t(
            "notifications.notified-on"
          )} `}</div>
          <NotificationFormComponent
            onSubmit={onSubmit}
            userNotification={userNotification}
          />
          {userNotification && (
            <>
              <div className="text-content-secondary pb-4">
                {t("notifications.unsubscribe-description")}
              </div>
              <Button
                className={`w-full`}
                variant="danger"
                endIcon={<Icons.Envelope />}
                type="button"
                title={`${t("notifications.unsubscribe")}`}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}
