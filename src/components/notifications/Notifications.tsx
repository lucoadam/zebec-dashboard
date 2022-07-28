import { useTranslation } from "next-i18next"
import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, CollapseDropdown, InputField } from "components/shared"
import * as Icons from "assets/icons"
import { notificationSchema } from "utils/validations/notificationSchema"
import { useClickOutside } from "hooks"

interface Notification {
  email: string
  telegram: string
}

export default function NotificationsComponent() {
  const { t } = useTranslation("")
  const [userNotification, setUserNotification] = useState<Notification>()

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(notificationSchema)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setUserNotification(data)
  }
  const [toggleNotificationsDropdown, setToggleNotificationsDropdown] =
    useState<boolean>(false)

  const handleNotificationClose = () => {
    setToggleNotificationsDropdown(false)
  }
  const NotificationsDropdownWrapperRef = useRef(null)

  //handle clicking outside
  useClickOutside(NotificationsDropdownWrapperRef, {
    onClickOutside: handleNotificationClose
  })
  return (
    <>
      <div className="relative h-8" ref={NotificationsDropdownWrapperRef}>
        <div
          className={` text-content-primary`}
          onClick={() =>
            setToggleNotificationsDropdown(!toggleNotificationsDropdown)
          }
        >
          <Icons.BellEditIcon className="cursor-pointer  w-6 h-6" />
        </div>
        <CollapseDropdown
          show={toggleNotificationsDropdown}
          className="top-12 w-[306px]"
        >
          <div className="rounded  p-6  ">
            <div className="text-content-primary font-semibold">{`${t(
              "common:notifications.notification-header"
            )} `}</div>
            <div className="text-content-secondary text-caption pb-4 pt-1 border-b border-outline">{`${t(
              "common:notifications.notification-subtitle"
            )} `}</div>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="">
                <div className="pt-6 ">
                  <InputField
                    label={t("common:notifications.email-address")}
                    className="relative text-content-secondary"
                    error={!!errors.email}
                    helper={t(
                      errors.email?.message?.toString() || ""
                    ).toString()}
                  >
                    <div>
                      <input
                        className={`w-full h-10 ${
                          !!errors.email?.message && "error"
                        }`}
                        placeholder={t("common:notifications.email-address")}
                        type="text"
                        {...register("email")}
                      />
                    </div>
                  </InputField>
                </div>

                <div className="pt-6 pb-6 ">
                  <InputField
                    label={t("common:notifications.telegram-username")}
                    className="relative text-content-secondary"
                    error={!!errors.telegram}
                    helper={t(
                      errors.telegram?.message?.toString() || ""
                    ).toString()}
                  >
                    <div>
                      <input
                        className={`w-full h-10 ${
                          !!errors.telegram?.message && "error"
                        }`}
                        placeholder={t("common:notifications.telegram-username")}
                        type="text"
                        {...register("telegram")}
                      />
                    </div>
                  </InputField>
                </div>

                {/* submit Button */}

                <div className="pb-2">
                  <Button
                    className={`w-full ${userNotification ? "hidden" : ""}`}
                    variant="gradient"
                    type="submit"
                    title={`${t("common:notifications.subscribe")}`}
                  />

                  {userNotification && (
                    <>
                      <div className="text-content-secondary pb-4">
                        {t("common:notifications.unsubscribe-description")}
                      </div>
                      <Button
                        className={`w-full`}
                        variant="danger"
                        endIcon={<Icons.Envelope />}
                        type="button"
                        title={`${t("common:notifications.unsubscribe")}`}
                      />
                    </>
                  )}
                </div>
              </div>
            </form>
            <div className="flex gap-x-1 justify-center mt-4">
              <div className="text-caption text-content-secondary">
              {t("common:notifications.powered-by")}
              </div>
              <div className="pb-4">
                <Icons.Notif className="w-16"/>
              </div>

            </div>
          </div>
        </CollapseDropdown>
        {/* </div> */}
      </div>
    </>
  )
}
