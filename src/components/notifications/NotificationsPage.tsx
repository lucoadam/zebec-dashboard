import { useTranslation } from "next-i18next"
import React, { useState } from "react"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, InputField } from "components/shared"
import * as Icons from "assets/icons"

interface Notification {
  email: string
  telegram: string
}

export default function NotificationsComponent() {
  const { t } = useTranslation("common")
  const [userNotification, setUserNotification] = useState<Notification>()

  const validationSchema = Yup.object().shape({
    email: Yup.string().required(t("validation:email-required")),
    telegram: Yup.string().required(t("validation:telegram-required"))
  })

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: "onChange" || "onSubmit",
    resolver: yupResolver(validationSchema)
  })

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
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="w-96">
              <div className="pt-6 ">
                <InputField
                  label={t("notifications.email-address")}
                  className="relative text-content-secondary"
                  error={!!errors.email}
                  helper={errors.email?.message?.toString() || ""}
                >
                  <div>
                    <input
                      className={`w-full h-10 ${
                        !!errors.email?.message && "error"
                      }`}
                      placeholder={t("notifications.email-address")}
                      type="text"
                      {...register("email")}
                    />
                  </div>
                </InputField>
              </div>

              <div className="pt-6 pb-6 ">
                <InputField
                  label={t("notifications.telegram-username")}
                  className="relative text-content-secondary"
                  error={!!errors.telegram}
                  helper={errors.telegram?.message?.toString() || ""}
                >
                  <div>
                    <input
                      className={`w-full h-10 ${
                        !!errors.telegram?.message && "error"
                      }`}
                      placeholder={t("notifications.telegram-username")}
                      type="text"
                      {...register("telegram")}
                    />
                  </div>
                </InputField>
              </div>

              {/* submit Button */}

              <div className="pb-20">
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
        </div>
      </div>
    </>
  )
}
