import React, { FC } from "react"
import { Button, DateTimePicker } from "components/shared"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import moment from "moment"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { exportProps } from "../ExportModal"
import { exportSchema } from "utils/validations/exportSchema"

export type FormKeys = "startDate" | "endDate"

const DefaultExport: FC<exportProps> = ({ setCurrentStep }) => {
  const { t } = useTranslation("transactions")

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    trigger
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(exportSchema)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
    setCurrentStep(1)
  }

  const getValue = (key: FormKeys) => {
    return getValues()[key]
  }

  return (
    <div className="">
      <div className="border-b-2 border-outline">
        <div className="text-content-primary text-subtitle font-semibold">
          {t("exportReport:export-report")}
        </div>
        <div className="text-content-secondary text-caption pb-6 ">
          {t("exportReport:export-modal-subtitle")}
        </div>
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="pt-3 ">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-content-secondary text-caption pb-1 pl-3">
                {t("exportReport:from")}
              </div>
              <DateTimePicker
                placeholder="dd/mm/yyyy"
                startIcon={<Icons.CalenderIcon />}
                endIcon={<Icons.CheveronDownIcon />}
                dateFormat="DD/MM/YYYY"
                timeFormat={false}
                value={
                  getValue("startDate") ||
                  moment().subtract(30, "days").format("DD/MM/YYYY")
                }
                onChange={(date) => {
                  setValue("startDate", moment(date).format("DD/MM/YYYY"))
                  trigger("startDate")
                  if (!!getValue("endDate")) {
                    trigger("endDate")
                  }
                }}
                error={!!errors.startDate}
              >
                <input
                  className={`w-full h-[40px] ${!!errors.startDate && "error"}`}
                  readOnly
                  {...register("startDate")}
                />
              </DateTimePicker>
              {!!errors.startDate && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {t(errors.startDate?.message?.toString() || "").toString()}
                </p>
              )}
            </div>
            <div>
              <div className="text-content-secondary text-caption pb-1 pl-3">
                {" "}
                {t("exportReport:to")}
              </div>
              <DateTimePicker
                placeholder={`dd/mm/yyyy`}
                startIcon={<Icons.CalenderIcon />}
                endIcon={<Icons.CheveronDownIcon />}
                dateFormat="DD/MM/YYYY"
                timeFormat={false}
                value={getValue("endDate") || moment().format("DD/MM/YYYY")}
                onChange={(date) => {
                  setValue("endDate", moment(date).format("DD/MM/YYYY"))
                  trigger("endDate")
                }}
                error={!!errors.endDate}
              >
                <input
                  className={`w-full h-[40px] ${!!errors.startDate && "error"}`}
                  readOnly
                  {...register("endDate")}
                />
              </DateTimePicker>
              {!!errors.endDate && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {t(errors.endDate?.message?.toString() || "").toString()}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="text-subtitle-sm pt-3 ">
            {t("exportReport:select-report-format")}
          </div>

          <div className="pt-3 pl-1">
            <label>
              <input
                type="radio"
                value={"csv"}
                className={`${!!errors.reportFormat && "error"}`}
                {...register("reportFormat")}
              />
              <span className="text-caption   pl-2">
                {t("exportReport:csv-format")}
              </span>
            </label>
          </div>
          <div className="pt-3 pl-1">
            <label>
              <input
                value={"pdf"}
                type="radio"
                className={`${!!errors.reportFormat && "error"}`}
                {...register("reportFormat")}
              />
              <span className="text-caption  pl-2 ">
                {t("exportReport:pdf-format")}
              </span>
            </label>
          </div>
          {!!errors.reportFormat && (
            <p className="text-content-secondary text-xs ml-[12px] mt-2">
              {t(errors.reportFormat?.message?.toString() || "").toString()}
            </p>
          )}
        </div>
        {/* prepare Report Button */}

        <div className="pt-8 ">
          <Button
            className={`w-full`}
            variant="gradient"
            type="submit"
            title={`${t("exportReport:prepare-report")}`}
          />
        </div>
      </form>
    </div>
  )
}

export default DefaultExport
