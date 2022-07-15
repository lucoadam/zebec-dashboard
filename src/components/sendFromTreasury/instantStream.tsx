/* eslint-disable @next/next/no-img-element */
import { yupResolver } from "@hookform/resolvers/yup"
import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, CollapseDropdown, InputField } from "components/shared"
import { FileUpload } from "components/shared/FileUpload"
import { useClickOutside } from "hooks"
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
  InstantFormKeys,
  InstantStreamFormData,
  InstantStreamProps
} from "./instantStream.d"

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

export const InstantStream: FC<InstantStreamProps> = ({
  setFormValues,
  tokenBalances,
  addFile,
  className
}) => {
  const { t } = useTranslation()
  const validationSchema: Yup.SchemaOf<InstantStreamFormData> =
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
  } = useForm<InstantStreamFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  })

  const tokensDropdownWrapper = useRef(null)
  const receiverDropdownWrapper = useRef(null)

  const [tokenSearchData, setTokenSearchData] = useState("")
  const [receiverSearchData, setReceiverSearchData] = useState("")
  const [toggleTokensDropdown, setToggleTokensDropdown] = useState(false)
  const [toggleReceiverDropdown, setToggleReceiverDropdown] = useState(false)
  const [showRemarks, setShowRemarks] = useState(false)

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

  //handle clicking outside
  useClickOutside(tokensDropdownWrapper, {
    onClickOutside: handleTokensClose
  })
  useClickOutside(receiverDropdownWrapper, {
    onClickOutside: handleReceiverClose
  })

  useEffect(() => {
    if (tokenDetails.length > 0) {
      setCurrentToken(tokenDetails[0])
      setValue("token", tokenDetails[0].symbol)
    }
  }, [tokenDetails, setValue])

  const onSubmit = (data: InstantStreamFormData) => {
    console.log(data)
  }

  const getValue = (key: InstantFormKeys) => {
    return getValues()[key]
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
          {t("send:instant-transfer")}
        </div>
        <div className="text-caption text-content-tertiary font-normal pt-2">
          {t("send:instant-transfer-description")}
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
                          <div className="text-content-primary">
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
                  className={`text-content-primary ml-3 text-xs font-medium mb-1`}
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
                    className={`w-full h-[40px] ${!!errors.amount && "error"}`}
                    placeholder={t("send:amount-placeholder")}
                    type="number"
                    step="any"
                    {...register("amount")}
                  />
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
                </div>
              </InputField>
            </div>
          </div>

          {/* Add file*/}
          {addFile && (
            <div className="mt-4">
              <FileUpload
                name={"file"}
                setValue={setValue}
                resetField={resetField}
              />
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
