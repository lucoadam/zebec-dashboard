import * as React from "react"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { NotificationProps } from "./NotificationsDropdown"
import { NotificationFormComponent } from "./NotificationFormComponent"

interface Notification {
  email: string
  telegram: string
}

export const NotificationForm: React.FC<NotificationProps> = ({
  setCurrentStep
}) => {
  const { t } = useTranslation("")
  const [userNotification, setUserNotification] = React.useState<Notification>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setUserNotification(data)
    setCurrentStep(1)
  }
  return (
    <>
      <div className="rounded  p-6  ">
        <div className="text-content-primary font-semibold">{`${t(
          "common:notifications.notification-header"
        )} `}</div>
        <div className="text-content-secondary text-caption pb-4 pt-1 border-b border-outline">{`${t(
          "common:notifications.notification-subtitle"
        )} `}</div>
        <NotificationFormComponent
          onSubmit={onSubmit}
          userNotification={userNotification}
        />

        <div className="flex gap-x-1 justify-center mt-4">
          <div className="text-caption text-content-secondary">
            {t("common:notifications.powered-by")}
          </div>
          <div className="pb-4">
            <Icons.Notif className="w-16" />
          </div>
        </div>
      </div>
    </>
  )
}
