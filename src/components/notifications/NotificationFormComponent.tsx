import * as React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, InputField } from "components/shared"

import { notificationSchema } from "utils/validations/notificationSchema"
import { useTranslation } from "next-i18next"

interface NotificationFormComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userNotification: any
}

export const NotificationFormComponent: React.FC<
  NotificationFormComponentProps
> = ({ onSubmit, userNotification }) => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(notificationSchema)
  })
  const { t } = useTranslation("")
  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="">
        <div className="pt-8">
          <InputField
            label={t("common:notifications.email-address")}
            className="relative text-content-secondary"
            error={!!errors.email}
            helper={t(errors.email?.message?.toString() || "").toString()}
          >
            <div>
              <input
                className={`w-[350px] h-10 ${
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
            helper={t(errors.telegram?.message?.toString() || "").toString()}
          >
            <div>
              <input
                className={`w-[350px] h-10 ${
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
            className={`w-[350px] ${userNotification ? "hidden" : ""}`}
            variant="gradient"
            type="submit"
            title={`${t("common:notifications.subscribe")}`}
          />
        </div>
      </div>
    </form>
  )
}
