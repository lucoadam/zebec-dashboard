import React, { FC, useEffect } from "react"
import { Button, InputField } from "components/shared"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { exportProps } from "../data"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

const DefaultExport: FC<exportProps> = ({
  setCurrentStep,

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
  const onSubmit = (data: any) => {
    
    setCurrentStep(1)
  }
 

  return (
    <div className="text-content-primary">
      <div className="text-content-primary text-subtitle font-semibold">
        {t("exportReport:export-report")}
      </div>
      <div className="text-content-secondary text-caption pb-4 ">
        {t("exportReport:export-modal-subtitle")}
      </div>
      
      {/* Input Field */}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="pt-3 pb-3">
        <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-content-secondary text-input-title"> {t("exportReport:from")}</div>
        </div>
        <div>
        <div className="text-content-secondary"> {t("exportReport:to")}</div>
        </div>

      </div>
          <InputField
            label={t("")}
            className="relative text-content-primary"
            helper={errors.withdrawamount?.message ?? ""}
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
                title={t("withdraw.max")}
                className={`absolute right-2.5 top-2 text-content-primary `}
                onClick={(e) => {
                  
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
            title={t("withdraw.withdraw")}
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

export default DefaultExport
