import React, { FC, useEffect } from "react"
import { Button, InputField } from "components/shared"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { withdrawProps } from "../data.d"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { withdrawAmountSchema } from "utils/validations/withdrawAmountSchema"

const EnterWithdrawAmount: FC<withdrawProps> = ({
  setCurrentStep,
  withdrawAmount,
  setWithdrawAmount,
  fees
}) => {
  const { t } = useTranslation("transactions")
  const totalAmount = 0
  const approxWithdrawableAmount = 0

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(withdrawAmountSchema)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setWithdrawAmount(data.withdrawAmount)
    setCurrentStep(1)
  }

  useEffect(() => {
    if (withdrawAmount != null && withdrawAmount != 0) {
      setValue("withdrawAmount", withdrawAmount)
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
            {t("withdraw.amount-received")} {totalAmount} SOL
          </div>
        </div>
        <div className="flex text-content-secondary pb-3">
          <div className="pr-2">
            {" "}
            <Icons.ArrowTopRight />
          </div>
          <div className="text-caption">
            {t("withdraw.withdrawable-amount")} {approxWithdrawableAmount} SOL
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
            helper={t(
              errors.withdrawAmount?.message?.toString() ?? ""
            ).toString()}
            error={!!errors.withdrawAmount?.message}
          >
            <div>
              <input
                className={`w-full h-10 ${
                  !!errors.withdrawAmount?.message && "error"
                }`}
                placeholder={t("withdraw.enter-amount")}
                type="number"
                {...register("withdrawAmount")}
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
        <div className="hidden pt-3">
          <div className="pr-2 text-warning">
            <Icons.WarningTriangleIcon />
          </div>
          <div className="text-warning text-caption">
            {t("withdraw.greater-amount")}
          </div>
        </div>

        {/* withdraw Button */}

        <div className="py-3">
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
          {fees}% {t("withdraw.withdrawal-fees")}
        </div>
      </div>
    </div>
  )
}

export default EnterWithdrawAmount
