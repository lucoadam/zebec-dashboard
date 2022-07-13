import React, { FC, useEffect } from "react"
import { Button, DateTimePicker, InputField } from "components/shared"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import moment from "moment"
import { exportProps } from "../data"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

export type FormKeys = "startDate" | "endDate"

const DefaultExport: FC<exportProps> = ({ setCurrentStep }) => {
  const { t } = useTranslation("transactions")

  const validationSchema: any = Yup.object().shape({
    startDate: Yup.string()
      .required(t("validation:start-date-time-required"))
      .test(
        "check-start-date",
        t("validation:start-date-time-before-today"),
        () => {
          return moment(`${getValue("startDate")}`, "DD/MM/YYYY LT").isAfter(
            moment()
          )
        }
      ),
    endDate: Yup.string()
      .required(t("validation:end-date-time-required"))
      .test(
        "check-end-date",
        t("validation:end-date-time-before-start-date-time"),
        () => {
          return (
            !getValue("startDate") ||
            moment(`${getValue("startDate")} `, "DD/MM/YYYY LT").isBefore(
              moment(`${getValue("endDate")}`, "DD/MM/YYYY LT")
            )
          )
        }
      )
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    trigger,
    resetField,
    watch
  } = useForm({
    mode: "onChange" || "onSubmit",
    resolver: yupResolver(validationSchema)
  })
  useEffect(() => {}, [, setValue])

  const onSubmit = (data: any) => {
    console.log(data)
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
        <div className="pt-3 pb-3">
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
                value={getValue("startDate")}
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
                value={getValue("endDate")}
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
            </div>
          </div>
        </div>
        <div>
          <div className="text-subtitle-sm pt-3 ">
            {t("exportReport:select-report-format")}
          </div>

          <div className="pt-3 pl-1">
            <label>
              <input type="radio" className="" name="pdf" />
              <span className="text-caption  pl-2">
                {t("exportReport:csv-format")}
              </span>
            </label>
          </div>
          <div className="pt-3 pl-1">
            <label>
              <input type="radio" className="" name="pdf" />
              <span className="text-caption  pl-2 ">
                {t("exportReport:pdf-format")}
              </span>
            </label>
          </div>
        </div>
        {/* prepare Report Button */}

        <div className="pt-8 ">
          <Button
            className={`w-full`}
            variant="gradient"
            type="submit"
            title={t("exportReport:prepare-report")}
            onClick={() => setCurrentStep(1)}
          />
        </div>
      </form>
    </div>
  )
}

export default DefaultExport
