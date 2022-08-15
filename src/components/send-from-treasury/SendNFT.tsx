/* eslint-disable @next/next/no-img-element */
import { yupResolver } from "@hookform/resolvers/yup"
import * as Icons from "assets/icons"
import { Button, CollapseDropdown, InputField, Toggle } from "components/shared"
import { useClickOutside } from "hooks"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { sendNFTSchema } from "utils/validations/sendNFTSchema"
import { SendNFTFormData, SendNFTProps } from "./TreasuryNFTStream.d"

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

export const SendNFT: FC<SendNFTProps> = ({
  setFormValues,
  className,
  nft,
  changeNFT
}) => {
  const { t } = useTranslation()
  // const dispatch = useAppDispatch()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    trigger,
    resetField,
    reset,
    watch
  } = useForm<SendNFTFormData>({
    mode: "onChange",
    resolver: yupResolver(sendNFTSchema)
  })

  const receiverDropdownWrapper = useRef(null)

  const [receiverSearchData, setReceiverSearchData] = useState("")
  const [toggleChooseNFT, setToggleChooseNFT] = useState(true)
  const [toggleReceiverDropdown, setToggleReceiverDropdown] = useState(false)

  const handleReceiverClose = () => {
    setToggleReceiverDropdown(false)
  }

  useEffect(() => {
    if (nft) {
      setValue("nftAddress", nft.address)
      setToggleChooseNFT(true)
    } else {
      resetField("nftAddress")
      setToggleChooseNFT(false)
    }
  }, [nft, setValue, trigger, resetField])

  useClickOutside(receiverDropdownWrapper, {
    onClickOutside: handleReceiverClose
  })

  const onSubmit = (data: SendNFTFormData) => {
    console.log(data)
    reset()
  }

  useEffect(() => {
    const subscription = watch(() => {
      if (setFormValues) {
        setFormValues(getValues())
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setFormValues, getValues])

  const toggleNFT = () => {
    resetField("nftAddress")
    if (toggleChooseNFT) {
      changeNFT && changeNFT(undefined)
    }
    setToggleChooseNFT(!toggleChooseNFT)
  }

  return (
    <>
      <div
        className={twMerge(
          "bg-background-secondary rounded-[4px] p-10",
          className ?? ""
        )}
      >
        <div className="text-heading-4 text-content-primary font-semibold">
          {t("send:nft")}
        </div>
        <div className="text-caption text-content-tertiary font-normal pt-2">
          {t("send:nft-description")}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          autoComplete="off"
        >
          {/* Transaction Name */}
          <div className="mt-12">
            <InputField
              label={t("send:transaction-name")}
              className="relative text-content-primary"
              error={false}
              labelMargin={12}
              helper={t(errors.transactionName?.message?.toString() ?? "")}
            >
              <div>
                <input
                  className={`!pr-[124px] w-full h-[40px] ${
                    !!errors.transactionName && "error"
                  }`}
                  placeholder={t("send:transaction-name")}
                  type="text"
                  {...register("transactionName")}
                />
              </div>
            </InputField>
          </div>
          {/**Receiver Wallet */}
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
                {t(errors.receiver?.message?.toString() ?? "")}
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
                          setValue("receiver", user.address)
                          trigger("receiver")
                        }}
                        className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light"
                      >
                        <div className="text-content-primary">{user.name}</div>
                        <div className="text-caption text-content-tertiary">
                          {toSubstring(user.address, 28, false)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CollapseDropdown>
          </div>

          {/** NFT address */}
          <div>
            <InputField
              label={t("send:nft-address")}
              className="relative text-content-primary"
              error={false}
              labelMargin={12}
              disabled={toggleChooseNFT}
              helper={t(errors.nftAddress?.message?.toString() ?? "")}
            >
              <div>
                <input
                  className={`!pr-[124px] w-full h-[40px] ${
                    !!errors.nftAddress && "error"
                  }`}
                  placeholder={t("send:enter-nft-address")}
                  type="text"
                  {...register("nftAddress")}
                  disabled={toggleChooseNFT}
                />
              </div>
            </InputField>
          </div>
          <div className="grid lg:grid-cols-2 gap-3">
            <Toggle
              checked={toggleChooseNFT}
              text={t("send:choose-nft")}
              onChange={toggleNFT}
            />
          </div>
          {/* Send button */}
          <div>
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
