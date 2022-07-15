/* eslint-disable @next/next/no-img-element */
import { yupResolver } from "@hookform/resolvers/yup"
import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import BigNumber from "bignumber.js"
import {
  Button,
  CollapseDropdown,
  DateTimePicker,
  InputField,
  TimePicker,
  Toggle
} from "components/shared"
import { FileUpload } from "components/shared/FileUpload"
import { useClickOutside } from "hooks"
import moment from "moment"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { formatCurrency } from "utils/formatCurrency"
import { getBalance } from "utils/getBalance"
import { isValidWallet } from "utils/isValidtWallet"
import * as Yup from "yup"
import {
  ContinuousStreamFormData,
  ContinuousStreamProps,
  FormKeys
} from "./continuousStream.d"

const addressBook = [
  {
    name: "Alice",
    address: "22fY53fd1PYwh8ZJS2iEwH72s6P1cT8oFjcSpp5atczv"
  },
  {
    name: "Bob",
    address: "6PXSmiqxFx3HHJyjAvA6Ub9aacTQCzeqQGd6Tp9jG6wZ"
  },
  {
    name: "Charlie",
    address: "EzQ3YybP36LpYUHaDSfXtJTpzXAkHEoML6QPoJfX2NQ6"
  },
  {
    name: "Dave",
    address: "2EEHxWqc1QcURMTrtdBUKCLonvYRkrGTdG6bcKfwZf7V"
  }
]

const intervals = [
  {
    key: "Months",
    value: 24 * 30 * 60
  },
  {
    key: "Weeks",
    value: 24 * 7 * 60
  },
  {
    key: "Days",
    value: 24 * 60
  },
  {
    key: "Hours",
    value: 60
  },
  {
    key: "Minutes",
    value: 1
  }
]

export const ContinuousStream: FC<ContinuousStreamProps> = ({
  setFormValues,
  tokenBalances,
  addFile,
  className
}) => {
  const { t } = useTranslation()
  const validationSchema: Yup.SchemaOf<ContinuousStreamFormData> =
    Yup.object().shape({
      transactionName: Yup.string().required(
        t("validation:transaction-name-required")
      ),
      receiverWallet: Yup.string()
        .required(t("validation:wallet-required"))
        .test("is-valid-address", t("validation:wallet-invalid"), (value) =>
          isValidWallet(value)
        ),
      remarks: Yup.string().test(
        "check-remarks",
        t("validation:remarks-required"),
        () => {
          return !!getValue("remarks") || !showRemarks
        }
      ),
      token: Yup.string().required(t("validation:token-required")),
      amount: Yup.string()
        .required(t("validation:amount-required"))
        .test("amount-invalid", t("validation:amount-invalid"), () => {
          return Number(getValue("amount")) > 0
        }),
      startDate: Yup.string()
        .required(t("validation:start-date-time-required"))
        .test(
          "check-start-date",
          t("validation:start-date-time-before-today"),
          () => {
            return moment(
              `${getValue("startDate")} ${getValue("startTime")}`,
              "DD/MM/YYYY LT"
            ).isAfter(moment())
          }
        ),
      startTime: Yup.string()
        .required(t("validation:start-date-time-required"))
        .test(
          "check-start-time",
          t("validation:start-date-time-before-today"),
          () => {
            return (
              !getValue("startDate") ||
              moment(
                `${getValue("startDate")} ${getValue("startTime")}`,
                "DD/MM/YYYY LT"
              ).isAfter(moment())
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
              !getValue("startTime") ||
              moment(
                `${getValue("startDate")} ${getValue("startTime")}`,
                "DD/MM/YYYY LT"
              ).isBefore(
                moment(
                  `${getValue("endDate")} ${getValue("endTime")}`,
                  "DD/MM/YYYY LT"
                )
              )
            )
          }
        ),
      endTime: Yup.string()
        .required(t("validation:end-date-time-required"))
        .test(
          "check-end-time",
          t("validation:end-date-time-before-start-date-time"),
          () => {
            return (
              !getValue("startDate") ||
              !getValue("startTime") ||
              moment(
                `${getValue("startDate")} ${getValue("startTime")}`,
                "DD/MM/YYYY LT"
              ).isBefore(
                moment(
                  `${getValue("endDate")} ${getValue("endTime")}`,
                  "DD/MM/YYYY LT"
                )
              )
            )
          }
        ),
      noOfTimes: Yup.string()
        .test("noOfTimes-required", t("validation:noOfTimes-required"), () => {
          return !!getValue("noOfTimes") || !enableStreamRate
        })
        .test("noOfTimes-invalid", t("validation:noOfTimes-invalid"), () => {
          return (
            (Number(getValue("noOfTimes")) > 0 &&
              Number.isInteger(Number(getValue("noOfTimes")))) ||
            !enableStreamRate
          )
        }),
      tokenAmount: Yup.string()
        .test(
          "tokenAmount-required",
          t("validation:tokenAmount-required"),
          () => {
            return !!getValue("tokenAmount") || !enableStreamRate
          }
        )
        .test(
          "tokenAmount-invalid",
          t("validation:tokenAmount-invalid"),
          () => {
            return Number(getValue("tokenAmount")) > 0 || !enableStreamRate
          }
        ),
      interval: Yup.string().test(
        "interval-required",
        t("validation:interval-required"),
        () => {
          return !!getValue("interval") || !enableStreamRate
        }
      ),
      file: Yup.string()
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
  } = useForm<ContinuousStreamFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  })

  const tokensDropdownWrapper = useRef(null)
  const receiverDropdownWrapper = useRef(null)
  const intervalDropdownWrapper = useRef(null)

  const [tokenSearchData, setTokenSearchData] = useState("")
  const [receiverSearchData, setReceiverSearchData] = useState("")
  const [toggleTokensDropdown, setToggleTokensDropdown] = useState(false)
  const [toggleReceiverDropdown, setToggleReceiverDropdown] = useState(false)
  const [toggleIntervalDropdown, setToggleIntervalDropdown] = useState(false)
  const [showRemarks, setShowRemarks] = useState(false)
  const [enableStreamRate, setEnableStreamRate] = useState(false)

  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)

  const [currentToken, setCurrentToken] = useState(
    tokenDetails[0] || {
      symbol: "",
      image: ""
    }
  )

  const handleTokensClose = () => {
    setToggleTokensDropdown(false)
  }
  const handleReceiverClose = () => {
    setToggleReceiverDropdown(false)
  }
  const handleIntervalClose = () => {
    setToggleIntervalDropdown(false)
  }

  //handle clicking outside
  useClickOutside(tokensDropdownWrapper, {
    onClickOutside: handleTokensClose
  })
  useClickOutside(receiverDropdownWrapper, {
    onClickOutside: handleReceiverClose
  })
  useClickOutside(intervalDropdownWrapper, {
    onClickOutside: handleIntervalClose
  })

  useEffect(() => {
    if (tokenDetails.length > 0) {
      setCurrentToken(tokenDetails[0])
      setValue("token", tokenDetails[0].symbol)
    }
  }, [tokenDetails, setValue])

  const onSubmit = (data: ContinuousStreamFormData) => {
    console.log(data)
  }

  const getValue = (key: FormKeys) => {
    return getValues()[key]
  }

  const handleStreamRate = () => {
    const selectedNoOfTimes = Number(getValue("noOfTimes")) || 0
    const selectedTokenAmount = Number(getValue("tokenAmount")) || 0
    const totalAmount = new BigNumber(selectedNoOfTimes)
      .multipliedBy(new BigNumber(selectedTokenAmount))
      .toFixed()
    setValue("amount", totalAmount)

    if (
      getValue("startDate") &&
      getValue("startTime") &&
      getValue("noOfTimes")
    ) {
      const selectedInterval =
        intervals.find((interval) => interval.key === getValue("interval"))
          ?.value || 0
      const timeDifference = selectedInterval * selectedNoOfTimes
      const endDateTime = moment(
        `${getValue("startDate")} ${getValue("startTime")}`,
        "DD/MM/YYYY LT"
      ).add(timeDifference, "minutes")
      setValue("endDate", endDateTime.format("DD/MM/YYYY"))
      setValue("endTime", endDateTime.format("LT"))
      trigger("endDate")
      trigger("endTime")
    }
  }

  const toggleStreamRate = () => {
    if (!enableStreamRate) {
      setValue("interval", intervals[0].key)
      handleStreamRate()
    } else {
      resetField("interval")
      resetField("noOfTimes")
      resetField("tokenAmount")
    }

    resetField("amount")
    resetField("endDate")
    resetField("endTime")
    setEnableStreamRate(!enableStreamRate)
  }

  useEffect(() => {
    const subscription = watch(() => {
      if (setFormValues) {
        setFormValues(getValues())
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setFormValues, getValues])

  return (
    <>
      <div
        className={twMerge(
          "bg-background-secondary rounded-[4px] p-10",
          className ?? ""
        )}
      >
        <div className="text-heading-4 text-content-primary font-semibold">
          {t("send:continuous-stream")}
        </div>
        <div className="text-caption text-content-tertiary font-normal pt-2">
          {t("send:continuous-stream-description")}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Transaction Name and Receiver Wallet */}
          <div className="mt-12 grid lg:grid-cols-2 gap-3">
            <div>
              <InputField
                label={t("send:transaction-name")}
                className="relative text-content-primary"
                error={false}
                labelMargin={12}
                helper={errors.transactionName?.message?.toString()}
              >
                <div>
                  <input
                    className={`${
                      !showRemarks && "!pr-[124px]"
                    } w-full h-[40px] ${!!errors.transactionName && "error"}`}
                    placeholder={t("send:transaction-name")}
                    type="text"
                    {...register("transactionName")}
                  />
                  {!showRemarks && (
                    <Button
                      size="small"
                      title={t("send:add-remarks")}
                      className="absolute right-[8px] top-[8px] text-content-primary"
                      endIcon={<Icons.PlusIncircleIcon />}
                      onClick={() => setShowRemarks(true)}
                      type="button"
                    />
                  )}
                </div>
              </InputField>
            </div>
            <div className="relative" ref={receiverDropdownWrapper}>
              <label
                className={`ml-3 text-content-primary text-xs font-medium mb-1`}
              >
                {t("send:receiver-wallet")}
              </label>
              <div className="relative text-content-primary">
                <input
                  type="text"
                  className={`h-[40px] w-full !pr-12 ${
                    !!errors.receiverWallet && "error"
                  }`}
                  placeholder={t("send:receiver-wallet-placeholder")}
                  {...register("receiverWallet")}
                />
                <Icons.CheveronDownIcon
                  onClick={() => setToggleReceiverDropdown((prev) => !prev)}
                  className="hover:cursor-pointer absolute w-6 h-6 top-2 right-4"
                />
              </div>
              {!!errors.receiverWallet && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {errors.receiverWallet?.message?.toString()}
                </p>
              )}
              <CollapseDropdown
                show={toggleReceiverDropdown}
                className="mt-8 w-full z-[99]"
                position="left"
              >
                <div className="rounded-t-lg bg-background-primary border border-outline">
                  <Icons.SearchIcon className="text-lg absolute left-[20px] top-[16px] text-content-secondary" />
                  <input
                    className="is-search w-full h-[48px] bg-background-primary"
                    placeholder={t("send:search-wallet")}
                    type="text"
                    onChange={(e) => setReceiverSearchData(e.target.value)}
                  />
                  <div className="divide-y divide-outline max-h-[206px] overflow-auto">
                    {addressBook
                      .filter((user) =>
                        user.name
                          .toLowerCase()
                          .includes(receiverSearchData.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.address}
                          onClick={(event) => {
                            event.stopPropagation()
                            setToggleReceiverDropdown(false)
                            setValue("receiverWallet", user.address)
                            trigger("receiverWallet")
                          }}
                          className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light"
                        >
                          <div className="text-sm text-content-primary">
                            {user.name}
                          </div>
                          <div className="text-caption text-content-tertiary">
                            {toSubstring(user.address, 28, false)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CollapseDropdown>
            </div>
          </div>

          {/* Remarks */}
          {showRemarks && (
            <div className="mt-4">
              <InputField
                label={t("send:remarks")}
                className="relative text-content-primary"
                error={false}
                labelMargin={12}
                helper={errors.remarks?.message?.toString()}
              >
                <div>
                  <input
                    className={`w-full h-[40px] ${!!errors.remarks && "error"}`}
                    placeholder={t("send:remarks-placeholder")}
                    type="text"
                    {...register("remarks")}
                  />
                  <Button
                    size="small"
                    title={t("send:remove-remarks")}
                    className="absolute right-[8px] top-[8px] text-content-primary"
                    endIcon={<Icons.CrossIcon />}
                    onClick={() => setShowRemarks(false)}
                    type="button"
                  />
                </div>
              </InputField>
            </div>
          )}

          {/* Token and amount */}
          <div className="mt-4 grid lg:grid-cols-2 gap-3">
            <div className="relative" ref={tokensDropdownWrapper}>
              <div className="flex justify-between">
                <label className="ml-3 text-content-primary text-xs font-medium mb-1">
                  {t("send:token")}
                </label>
                <label
                  className={`text-content-tertiary text-xs font-normal mb-1`}
                >
                  {t("send:balance")}{" "}
                  {formatCurrency(
                    getBalance(tokenBalances, currentToken.symbol)
                  )}{" "}
                  {currentToken.symbol}
                </label>
              </div>
              <div
                className="relative text-content-primary"
                onClick={() => setToggleTokensDropdown((prev) => !prev)}
              >
                {currentToken.image && (
                  <img
                    className="w-[18px] h-[18px] absolute top-3 left-5 text-lg"
                    src={currentToken.image}
                    alt={currentToken.symbol}
                  />
                )}
                <input
                  type="text"
                  className={`h-[40px] w-full !pl-11 ${
                    !!errors.token && "error"
                  }`}
                  readOnly
                  {...register("token")}
                />
                <Icons.CheveronDownIcon className="w-6 h-6 hover:cursor-pointer absolute top-2 right-4" />
              </div>
              {!!errors.token && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {errors.token?.message?.toString()}
                </p>
              )}
              <CollapseDropdown
                show={toggleTokensDropdown}
                className="mt-8 w-full z-[99]"
                position="left"
              >
                <div className="rounded-t-lg bg-background-primary border border-outline">
                  <Icons.SearchIcon className="text-lg absolute left-[20px] top-[16px] text-content-secondary" />
                  <input
                    className="is-search w-full h-[48px] bg-background-primary"
                    placeholder={t("send:search-token")}
                    type="text"
                    onChange={(e) => setTokenSearchData(e.target.value)}
                  />
                  <div className="divide-y divide-outline max-h-[194px] overflow-auto">
                    {tokenDetails
                      .filter((token) =>
                        token.symbol.includes(tokenSearchData.toUpperCase())
                      )
                      .map((item) => (
                        <div
                          key={item.symbol}
                          onClick={(event) => {
                            event.stopPropagation()
                            setToggleTokensDropdown(false)
                            setCurrentToken(item)
                            setValue("token", item.symbol)
                            trigger("token")
                          }}
                          className="border-outline flex cursor-pointer overflow-hidden py-8 px-5 justify-start items-center hover:bg-background-light h-[40px]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="w-[18px] h-[18px] mr-[12px]  text-content-primary"
                            src={item.image}
                            alt={item.symbol}
                          />
                          <div>
                            <div className="text-content-primary ">
                              {item.symbol}
                            </div>
                            <div className="text-caption text-content-tertiary">
                              {item.name}
                            </div>
                          </div>
                          <div className="ml-auto text-caption  text-content-secondary">
                            {getBalance(tokenBalances, item.symbol)}{" "}
                            {item.symbol}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CollapseDropdown>
            </div>
            <div>
              <div className="flex justify-between">
                <label
                  className={`${
                    enableStreamRate
                      ? "text-content-tertiary"
                      : "text-content-primary"
                  } ml-3 text-xs font-medium mb-1`}
                >
                  {t("send:amount")}
                </label>
                <label
                  className={`text-content-tertiary text-xs font-normal mb-1`}
                >
                  {formatCurrency(
                    (currentToken.usdPrice || 0) * Number(getValue("amount")) ||
                      0,
                    "$"
                  )}{" "}
                  {currentToken.symbol}
                </label>
              </div>
              <InputField
                className="relative text-content-primary"
                error={false}
                labelMargin={12}
                helper={errors.amount?.message?.toString()}
              >
                <div>
                  <input
                    className={`${
                      !enableStreamRate && "!pr-14"
                    } w-full h-[40px] ${!!errors.amount && "error"}`}
                    placeholder={t("send:amount-placeholder")}
                    type="number"
                    step="any"
                    disabled={enableStreamRate}
                    {...register("amount")}
                  />
                  {!enableStreamRate && (
                    <Button
                      size="small"
                      title={t("send:max")}
                      className="absolute right-[8px] top-[8px] text-content-primary"
                      onClick={() =>
                        setValue(
                          "amount",
                          getBalance(
                            tokenBalances,
                            currentToken.symbol
                          ).toString()
                        )
                      }
                      type="button"
                    />
                  )}
                </div>
              </InputField>
            </div>
          </div>

          {/* Stream start and Stream end */}
          <div className="mt-4 grid lg:grid-cols-2 gap-3">
            <div>
              <div>
                <label className="ml-3 text-content-primary text-xs font-medium mb-1">
                  {t("send:stream-start")}
                </label>
                <DateTimePicker
                  placeholder="E.g. 01/01/2022"
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                  value={getValue("startDate")}
                  onChange={(date) => {
                    setValue("startDate", moment(date).format("DD/MM/YYYY"))
                    trigger("startDate")
                    if (getValue("startTime")) {
                      trigger("startTime")
                    }
                    if (!!getValue("endTime") || !!getValue("endDate")) {
                      trigger("endDate")
                      trigger("endTime")
                    }
                    if (enableStreamRate) handleStreamRate()
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
              <div className="mt-4">
                <TimePicker
                  error={!!errors.startTime}
                  name="startTime"
                  register={register}
                  placeholder="E.g. 12:00 AM"
                  onChange={(time) => {
                    setValue("startTime", time)
                    trigger("startTime")
                    if (getValue("startDate")) {
                      trigger("startDate")
                    }
                    if (!!getValue("endTime") || !!getValue("endDate")) {
                      trigger("endDate")
                      trigger("endTime")
                    }
                    if (enableStreamRate) handleStreamRate()
                  }}
                />
              </div>
              {(!!errors.startDate || !!errors.startTime) && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {(errors.startDate || errors.startTime)?.message?.toString()}
                </p>
              )}
            </div>
            <div>
              <div>
                <label
                  className={`${
                    enableStreamRate
                      ? "text-content-tertiary"
                      : "text-content-primary"
                  } ml-3 text-xs font-medium mb-1`}
                >
                  {t("send:stream-end")}
                </label>
                <DateTimePicker
                  placeholder="E.g. 30/01/2022"
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                  disabled={enableStreamRate}
                  value={getValue("endDate")}
                  onChange={(date) => {
                    setValue("endDate", moment(date).format("DD/MM/YYYY"))
                    trigger("endDate")
                    if (getValue("endTime")) {
                      trigger("endTime")
                    }
                  }}
                  error={!!errors.endDate}
                >
                  <input type="text" readOnly {...register("endDate")} />
                </DateTimePicker>
              </div>
              <div className="mt-4">
                <TimePicker
                  placeholder="E.g. 12:00 AM"
                  name="endTime"
                  register={register}
                  disabled={enableStreamRate}
                  onChange={(time) => {
                    setValue("endTime", time)
                    trigger("endTime")
                    if (getValue("endDate")) {
                      trigger("endDate")
                    }
                  }}
                  error={!!errors.endTime}
                />
              </div>
              {(!!errors.endDate || !!errors.endTime) && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {(errors.endDate || errors.endTime)?.message?.toString()}
                </p>
              )}
            </div>
          </div>

          {/* Toggle stream rate and Add file*/}
          <div className="mt-4 grid lg:grid-cols-2 gap-3">
            <Toggle
              text={t("send:enable-stream-rate")}
              onChange={toggleStreamRate}
            />
            {addFile && (
              <FileUpload
                name={"file"}
                setValue={setValue}
                resetField={resetField}
              />
            )}
          </div>

          {/* Stream rate field */}
          {enableStreamRate && (
            <div className="mt-4 grid lg:grid-cols-3 gap-3">
              <div>
                <InputField
                  label={t("send:no-of-times")}
                  className="relative text-content-primary"
                  error={false}
                  labelMargin={12}
                  helper={errors.noOfTimes?.message?.toString()}
                >
                  <div>
                    <input
                      className={`w-full h-[40px] ${
                        !!errors.noOfTimes && "error"
                      }`}
                      placeholder={"E.g. 4"}
                      type="number"
                      step="any"
                      {...register("noOfTimes")}
                      onChange={(e) => {
                        setValue("noOfTimes", e.target.value)
                        handleStreamRate()
                        trigger("noOfTimes")
                      }}
                    />
                  </div>
                </InputField>
              </div>
              <div>
                <InputField
                  error={!!errors.tokenAmount}
                  helper={errors.tokenAmount?.message?.toString()}
                  label={t("send:token-amount")}
                  placeholder={"E.g. 10"}
                  type="number"
                  step="any"
                  className="w-full h-[40px]"
                  labelMargin={12}
                >
                  <input
                    className={`w-full h-[40px]`}
                    type="number"
                    step="any"
                    {...register("tokenAmount")}
                    onChange={(e) => {
                      setValue("tokenAmount", e.target.value)
                      handleStreamRate()
                      trigger("tokenAmount")
                    }}
                  />
                </InputField>
              </div>
              <div ref={intervalDropdownWrapper} className="relative">
                <label
                  className={`ml-3 text-content-primary text-xs font-medium mb-1`}
                >
                  {t("send:time-interval")}
                </label>
                <div
                  className="relative text-content-primary"
                  onClick={() => setToggleIntervalDropdown((prev) => !prev)}
                >
                  <input
                    type="text"
                    className="h-[40px] w-full"
                    readOnly
                    {...register("interval")}
                  />
                  <Icons.CheveronDownIcon className="absolute top-3 right-1 text-lg" />
                </div>
                <CollapseDropdown
                  show={toggleIntervalDropdown}
                  className="mt-8 w-full z-[99]"
                  position="left"
                >
                  <div className="rounded-lg bg-background-primary border border-outline">
                    <div className="divide-y divide-outline max-h-[206px] overflow-auto">
                      {intervals.map((data) => (
                        <div
                          key={data.key}
                          onClick={(event) => {
                            event.stopPropagation()
                            setToggleIntervalDropdown(false)
                            setValue("interval", data.key)
                            handleStreamRate()
                          }}
                          className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light"
                        >
                          <div className="text-content-primary">{data.key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapseDropdown>
              </div>
            </div>
          )}

          {/* Send button */}
          <div className="mt-12">
            <Button
              className="w-full"
              variant="gradient"
              title={t("send:send")}
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}
