import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { AmountField } from "components/dca/components/AmountField"
import {
  Button,
  CollapseDropdown,
  DateTimePicker,
  TimePicker
} from "components/shared"
import moment from "moment"
import { useTranslation } from "next-i18next"
import { FC, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { formatCurrency } from "utils"
import { StepsComponentProps } from "../CreateDCA.d"

export const InitializeDCA: FC<StepsComponentProps> = ({ dca }) => {
  const { t } = useTranslation()

  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)

  const dropdownWrapper = useRef(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [frequncy, setFrequency] = useState("Daily")
  const [currentToken, setCurrentToken] = useState({
    symbol: "SOL",
    image: ""
  })

  const {
    handleSubmit,
    register,
    setValue,
    trigger,
    getValues,
    formState: { errors }
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h3 className="leading-7 font-semibold mb-2 text-heading-4 text-content-primary">
          {t("createDCA:second-steper.title")}
        </h3>
        <p className="text-content-tertiary font-normal text-caption mb-[32px]">
          {t("createDCA:second-steper.description")}
        </p>
        <div className="flex flex-col gap-6">
          {/** Token to buy */}
          <div className="relative">
            <div className="flex justify-between">
              <label
                className={`text-content-secondary text-xs font-medium mb-1`}
              >
                Token to Buy
              </label>
              <label
                className={`text-content-tertiary text-xs font-medium mb-1`}
              >
                Deposited Fund: {formatCurrency(dca.depositAmount, "", 4)}{" "}
                {dca.symbol ?? "SOL"}
              </label>
            </div>
            <AmountField
              register={register}
              setValue={setValue}
              tokens={tokenDetails}
              currentToken={currentToken}
              setCurrentToken={setCurrentToken}
              name="amount"
              error={errors.amount?.message?.toString()}
            />
          </div>
          {/** Frequncy to Buy */}
          <div className="relative" ref={dropdownWrapper}>
            <label
              className={`text-content-secondary text-xs font-medium mb-1`}
            >
              Frequency to Buy
            </label>
            <div
              onClick={() => setToggleDropdown(!toggleDropdown)}
              className="cursor-pointer relative text-content-primary"
            >
              <input
                type="text"
                value={frequncy}
                className={`cursor-pointer h-[40px] w-full !pr-12`}
                placeholder={"Select where you’re depositing from"}
                readOnly
              />
              <Icons.CheveronDownIcon className="absolute w-6 h-6 top-2 right-4" />
            </div>
            <CollapseDropdown
              show={toggleDropdown}
              className="mt-8 w-full z-[99]"
              position="left"
            >
              <div className="bg-background-primary border border-outline rounded-lg divide-y divide-outline max-h-[206px] overflow-auto">
                {["Daily", "Weekly", "Quaterly"].map((item) => (
                  <div
                    key={item}
                    onClick={(event) => {
                      event.stopPropagation()
                      setToggleDropdown(false)
                      setFrequency(item)
                    }}
                    className={`border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light`}
                  >
                    <div className="text-sm text-content-primary">{item}</div>
                  </div>
                ))}
              </div>
            </CollapseDropdown>
          </div>

          {/** DCA start */}
          <div>
            <label className="ml-3 text-content-primary text-xs font-medium mb-1">
              {t("createDCA:start-dca")}
            </label>
            <div className="grid grid-cols-2">
              <div>
                <DateTimePicker
                  placeholder="E.g. 01/01/2022"
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                  value={getValues().startDate || moment().format("DD/MM/YYYY")}
                  onChange={(date) => {
                    setValue("startDate", moment(date).format("DD/MM/YYYY"))
                    trigger("startDate")
                    if (getValues().startTime) {
                      trigger("startTime")
                    }
                    // if (getValues().enableStreamRate) handleStreamRate()
                  }}
                  error={!!errors.startDate}
                >
                  <input
                    className={`w-full h-[40px] ${
                      !!errors.startDate && "error"
                    }`}
                    readOnly
                    {...register("startDate")}
                  />
                </DateTimePicker>
              </div>
              <div>
                <TimePicker
                  error={!!errors.startTime}
                  name="startTime"
                  register={register}
                  placeholder="E.g. 12:00 AM"
                  value={getValues().startTime || moment().format("hh:mm A")}
                  onChange={(time) => {
                    setValue("startTime", time)
                    trigger("startTime")
                    if (getValues().startDate) {
                      trigger("startDate")
                    }
                    // if (getValues().enableStreamRate) handleStreamRate()
                  }}
                />
              </div>
            </div>
            {(!!errors.startDate || !!errors.startTime) && (
              <p className="text-content-secondary text-xs ml-[12px] mt-1">
                {t(
                  (errors.startDate || errors.startTime)?.message?.toString() ||
                    ""
                ).toString()}
              </p>
            )}
          </div>
        </div>
        <Button
          title={`${t("common:buttons.confirm-and-start-dca")}`}
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          type="submit"
        />
      </form>
    </>
  )
}
