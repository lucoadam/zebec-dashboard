/* eslint-disable @next/next/no-img-element */
import { yupResolver } from "@hookform/resolvers/yup"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
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
import { Token } from "components/shared/Token"
import { constants } from "constants/constants"
import {
  sendContinuousStream,
  sendTreasuryContinuousStream
} from "features/stream/streamSlice"
import { fetchOutgoingTransactions } from "features/transactions/transactionsSlice"
import { useClickOutside } from "hooks"
import moment from "moment"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { formatCurrency } from "utils/formatCurrency"
import { getBalance } from "utils/getBalance"
import { continuousSchema } from "utils/validations/continuousStreamSchema"
import {
  ContinuousStreamFormData,
  ContinuousStreamProps
} from "./ContinuousStream.d"

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
  className,
  type = "send"
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

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
    resolver: yupResolver(continuousSchema)
  })

  const tokensDropdownWrapper = useRef(null)
  const receiverDropdownWrapper = useRef(null)
  const intervalDropdownWrapper = useRef(null)

  const [tokenSearchData, setTokenSearchData] = useState("")
  const [receiverSearchData, setReceiverSearchData] = useState("")
  const [toggleTokensDropdown, setToggleTokensDropdown] = useState(false)
  const [toggleReceiverDropdown, setToggleReceiverDropdown] = useState(false)
  const [toggleIntervalDropdown, setToggleIntervalDropdown] = useState(false)
  // const [resetFile, setResetFile] = useState(false)

  const { publicKey } = useWallet()
  const { tokens: tokenDetails, prices } = useAppSelector(
    (state) => state.tokenDetails
  )

  const [currentToken, setCurrentToken] = useState(
    tokenDetails[0] || {
      symbol: "",
      image: "",
      mint: ""
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
      setValue("symbol", tokenDetails[0].symbol)
    }
  }, [tokenDetails, setValue])

  useEffect(() => {
    if (publicKey) {
      setValue("wallet", publicKey.toString())
    }
  }, [publicKey, setValue])

  const onSubmit = async (data: ContinuousStreamFormData) => {
    const formattedData = {
      transaction_name: data.transaction_name,
      symbol: data.symbol,
      amount: Number(data.amount),
      remarks: data.remarks || "",
      receiver: data.receiver,
      sender: data.wallet,
      start_time: moment(
        `${data.startDate} ${data.startTime}`,
        "DD/MM/YYYY LT"
      ).unix(),
      end_time: moment(
        `${data.endDate} ${data.endTime}`,
        "DD/MM/YYYY LT"
      ).unix(),
      token_mint_address:
        currentToken.mint === "solana" ? "" : currentToken.mint,
      file: data.file
    }
    if (type === "send") {
      await dispatch(sendContinuousStream(formattedData))
    } else {
      await dispatch(sendTreasuryContinuousStream(formattedData))
    }
    dispatch(fetchOutgoingTransactions(publicKey?.toString()))
  }

  const handleStreamRate = () => {
    const selectedNoOfTimes = Number(getValues().noOfTimes) || 0
    const selectedTokenAmount = Number(getValues().tokenAmount) || 0
    const totalAmount = new BigNumber(selectedNoOfTimes)
      .multipliedBy(new BigNumber(selectedTokenAmount))
      .toFixed()
    setValue("amount", totalAmount)

    if (
      getValues().startDate &&
      getValues().startTime &&
      getValues().noOfTimes
    ) {
      const selectedInterval =
        intervals.find((interval) => interval.key === getValues().interval)
          ?.value || 0
      const timeDifference = selectedInterval * selectedNoOfTimes
      const endDateTime = moment(
        `${getValues().startDate} ${getValues().startTime}`,
        "DD/MM/YYYY LT"
      ).add(timeDifference, "minutes")
      setValue("endDate", endDateTime.format("DD/MM/YYYY"))
      setValue("endTime", endDateTime.format("LT"))
      trigger("endDate")
      trigger("endTime")
    }
  }

  const toggleStreamRate = () => {
    if (!getValues().enableStreamRate) {
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
    setValue("enableStreamRate", !getValues().enableStreamRate)
  }

  useEffect(() => {
    const subscription = watch(() => {
      if (setFormValues) {
        setFormValues(getValues())
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setFormValues, getValues])

  useEffect(() => {
    dispatch(fetchOutgoingTransactions(publicKey?.toString()))
  }, [publicKey, dispatch])

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
                helper={t(
                  errors.transaction_name?.message?.toString() || ""
                ).toString()}
              >
                <div>
                  <input
                    className={`${
                      !getValues().showRemarks && "!pr-[124px]"
                    } w-full h-[40px] ${!!errors.transaction_name && "error"}`}
                    placeholder={t("send:transaction-name")}
                    type="text"
                    {...register("transaction_name")}
                  />
                  {!getValues().showRemarks && (
                    <Button
                      size="small"
                      title={`${t("send:add-remarks")}`}
                      className="absolute right-[8px] top-[8px] text-content-primary"
                      endIcon={<Icons.PlusIncircleIcon />}
                      onClick={() => setValue("showRemarks", true)}
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
                    !!errors.receiver && "error"
                  }`}
                  placeholder={t("send:receiver-wallet-placeholder")}
                  {...register("receiver")}
                />
                <Icons.CheveronDownIcon
                  onClick={() => setToggleReceiverDropdown((prev) => !prev)}
                  className="hover:cursor-pointer absolute w-6 h-6 top-2 right-4"
                />
              </div>
              {!!errors.receiver && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {t(errors.receiver?.message?.toString() || "")}
                </p>
              )}
              <CollapseDropdown
                show={toggleReceiverDropdown}
                className="mt-8 w-full z-[99]"
                position="left"
              >
                <div className="rounded-lg bg-background-primary border border-outline">
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
                            setValue("receiver", user.address)
                            trigger("receiver")
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
          {getValues().showRemarks && (
            <div className="mt-4">
              <InputField
                label={t("send:remarks")}
                className="relative text-content-primary"
                error={false}
                labelMargin={12}
                helper={t(errors.remarks?.message?.toString() || "").toString()}
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
                    title={`${t("send:remove-remarks")}`}
                    className="absolute right-[8px] top-[8px] text-content-primary"
                    endIcon={<Icons.CrossIcon />}
                    onClick={() => setValue("showRemarks", false)}
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
                {currentToken.symbol && (
                  <Token
                    symbol={currentToken.symbol}
                    className="w-[18px] h-[18px] absolute top-3 left-5 text-lg"
                  />
                )}
                <input
                  type="text"
                  className={`h-[40px] w-full !pl-11 ${
                    !!errors.symbol && "error"
                  }`}
                  readOnly
                  {...register("symbol")}
                />
                <Icons.CheveronDownIcon className="w-6 h-6 hover:cursor-pointer absolute top-2 right-4" />
              </div>
              {!!errors.symbol && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {t(errors.symbol?.message?.toString() || "")}
                </p>
              )}
              <CollapseDropdown
                show={toggleTokensDropdown}
                className="mt-8 w-full z-[99]"
                position="left"
              >
                <div className="rounded-lg bg-background-primary border border-outline">
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
                            setValue("symbol", item.symbol)
                            trigger("symbol")
                          }}
                          className="border-outline flex cursor-pointer overflow-hidden py-8 px-5 justify-start items-center hover:bg-background-light h-[40px]"
                        >
                          <Token
                            symbol={item.symbol}
                            className="w-[18px] h-[18px] mr-[12px]  text-content-primary"
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
                    getValues().enableStreamRate
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
                    prices[currentToken.symbol] * Number(getValues().amount) ||
                      0,
                    "$"
                  )}{" "}
                </label>
              </div>
              <InputField
                className="relative text-content-primary"
                error={false}
                labelMargin={12}
                helper={t(errors.amount?.message?.toString() || "").toString()}
              >
                <div>
                  <input
                    className={`${
                      !getValues().enableStreamRate && "!pr-14"
                    } w-full h-[40px] ${!!errors.amount && "error"}`}
                    placeholder={t("send:amount-placeholder")}
                    type="number"
                    step="any"
                    disabled={getValues().enableStreamRate}
                    {...register("amount")}
                  />
                  {!getValues().enableStreamRate && (
                    <Button
                      size="small"
                      title={`${t("send:max")}`}
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
                  value={getValues().startDate || moment().format("DD/MM/YYYY")}
                  onChange={(date) => {
                    setValue("startDate", moment(date).format("DD/MM/YYYY"))
                    trigger("startDate")
                    if (getValues().startTime) {
                      trigger("startTime")
                    }
                    if (!!getValues().endTime || !!getValues().endDate) {
                      trigger("endDate")
                      trigger("endTime")
                    }
                    if (getValues().enableStreamRate) handleStreamRate()
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
                  value={
                    getValues().startTime ||
                    moment()
                      .add(constants.STREAM_START_ADD, "minutes")
                      .format("hh:mm A")
                  }
                  onChange={(time) => {
                    setValue("startTime", time)
                    trigger("startTime")
                    if (getValues().startDate) {
                      trigger("startDate")
                    }
                    if (!!getValues().endTime || !!getValues().endDate) {
                      trigger("endDate")
                      trigger("endTime")
                    }
                    if (getValues().enableStreamRate) handleStreamRate()
                  }}
                />
              </div>
              {(!!errors.startDate || !!errors.startTime) && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {t(
                    (
                      errors.startDate || errors.startTime
                    )?.message?.toString() || ""
                  ).toString()}
                </p>
              )}
            </div>
            <div>
              <div>
                <label
                  className={`${
                    getValues().enableStreamRate
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
                  disabled={getValues().enableStreamRate}
                  value={getValues().endDate}
                  onChange={(date) => {
                    setValue("endDate", moment(date).format("DD/MM/YYYY"))
                    trigger("endDate")
                    if (getValues().endTime) {
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
                  disabled={getValues().enableStreamRate}
                  onChange={(time) => {
                    setValue("endTime", time)
                    trigger("endTime")
                    if (getValues().endDate) {
                      trigger("endDate")
                    }
                  }}
                  error={!!errors.endTime}
                />
              </div>
              {(!!errors.endDate || !!errors.endTime) && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {t(
                    (errors.endDate || errors.endTime)?.message?.toString() ||
                      ""
                  ).toString()}
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
                // isReset={resetFile}
              />
            )}
          </div>

          {/* Stream rate field */}
          {getValues().enableStreamRate && (
            <div className="mt-4 grid lg:grid-cols-3 gap-3">
              <div>
                <InputField
                  label={t("send:no-of-times")}
                  className="relative text-content-primary"
                  error={false}
                  labelMargin={12}
                  helper={t(
                    errors.noOfTimes?.message?.toString() || ""
                  ).toString()}
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
                  helper={t(
                    errors.tokenAmount?.message?.toString() || ""
                  ).toString()}
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
                  className="mt-8 w-full z-[99] rounded-lg"
                  position="left"
                >
                  <div className="bg-background-primary border border-outline rounded-lg divide-y divide-outline max-h-[206px] overflow-auto">
                    {intervals.map((data) => (
                      <div
                        key={data.key}
                        onClick={(event) => {
                          event.stopPropagation()
                          setToggleIntervalDropdown(false)
                          setValue("interval", data.key)
                          handleStreamRate()
                        }}
                        className={`cursor-pointer p-4 justify-start items-center hover:bg-background-light`}
                      >
                        <div className="text-content-primary">{data.key}</div>
                      </div>
                    ))}
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
              title={`${t("send:send")}`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}
