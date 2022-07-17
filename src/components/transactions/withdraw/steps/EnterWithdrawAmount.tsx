import React, { FC, useEffect } from "react"
import { Button, InputField } from "components/shared"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { withdrawProps } from "../data.d"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

const EnterWithdrawAmount: FC<withdrawProps> = ({
  setCurrentStep,
  withdrawAmount,
  setWithdrawAmount
}) => {
  const { t } = useTranslation("transactions")

  const validationSchema = Yup.object().shape({
    withdrawamount: Yup.string()
      .required(t("withdraw.enter-withdraw-amount"))
      .test("is-not-zero", t("withdraw.not-zero"), (value) => {
        {
          console.log("value", typeof value)
        }
        return typeof value === "string" && parseFloat(value) > 0
      })
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    mode: "onChange" || "onSubmit",
    resolver: yupResolver(validationSchema)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setWithdrawAmount(data.withdrawamount)
    setCurrentStep(1)
  }
  useEffect(() => {
    if (withdrawAmount != null && withdrawAmount != 0) {
      setValue("withdrawamount", withdrawAmount)
    }
  }, [withdrawAmount, setValue])

  return (
    <div className="text-content-primary">
      <div className="text-content-primary text-subtitle font-semibold">
        {t("withdraw.withdraw-modal-header")}
      </div>
      <div className="text-content-secondary text-caption pb-4">
        {t("withdraw.withdraw-modal-subtitle")}
      </div>
      <div className="bg-background-tertiary rounded-md p-4">
        <div className="flex text-content-secondary pb-4">
          <div className="pr-2">
            {" "}
            <Icons.ArrowDownLeft />
          </div>
          <div className="text-caption ">
            {t("withdraw.amount-received")} 20000 SOL
          </div>
        </div>
        <div className="flex text-content-secondary pb-3">
          <div className="pr-2">
            {" "}
            <Icons.ArrowTopRight />
          </div>
          <div className="text-caption">
            {t("withdraw.withdrawable-amount")} 20000 SOL
          </div>
        </div>
        <div className="flex items-start text-content-contrast">
          <div className="pr-2 pt-0.5 ">
            {" "}
            <Icons.Info />
          </div>
          <div className="text-caption">{t("withdraw.withdraw-info")}</div>
        </div>
      </div>
      {/* Input Field */}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="pt-3 pb-3">
          <InputField
            label={t("")}
            className="relative text-content-primary"
            helper={errors.withdrawamount?.message?.toString() ?? ""}
            error={!!errors.withdrawamount?.message}
          >
            <div>
              <input
                className={`w-full h-10 ${
                  !!errors.withdrawamount?.message && "error"
                }`}
                placeholder={t("withdraw.enter-amount")}
                type="number"
                {...register("withdrawamount")}
                autoFocus
              />
              <Button
                size="small"
                title={`${t("withdraw.max")}`}
                className={`absolute right-2.5 top-2 text-content-primary `}
                onClick={() => {
                  setWithdrawAmount(10)
                }}
                type="button"
              />
            </div>
          </InputField>
        </div>

        {/* warning text */}
        <div className="flex pb-3 hidden">
          <div className="pr-2 text-warning">
            <Icons.WarningTriangleIcon />
          </div>
          <div className="text-warning text-caption">
            {t("withdraw.greater-amount")}
          </div>
        </div>

        {/* withdraw Button */}

        <div className="pb-3">
          <Button
            className={`w-full`}
            variant="gradient"
            type="submit"
            title={`${t("withdraw.withdraw")}`}
          />
        </div>
      </form>

      <div className="flex text-content-secondary items-center justify-center gap-x-2">
        <div className="">
          {" "}
          <Icons.Info />
        </div>
        <div className="text-caption ">
          {" "}
          0.25% {t("withdraw.withdrawal-fees")}
        </div>
      </div>
    </div>
  )
}

export default EnterWithdrawAmount
