/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import * as AvatarImages from "assets/images/avatars"
import {
  Button,
  CollapseDropdown,
  TokensDropdown,
  WithdrawDepositInput
} from "components/shared"
import { useClickOutside } from "hooks"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import Image, { StaticImageData } from "next/image"
import { useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { formatCurrency } from "utils"
import { getBalance } from "utils/getBalance"

export const Deposit = () => {
  const { t } = useTranslation()
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4
  ]
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const zebecBalance =
    useAppSelector((state) => state.zebecBalance.tokens) || []
  const walletBalance =
    useAppSelector((state) => state.walletBalance.tokens) || []

  const dropdownWrapper = useRef(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [depositFrom, setDepositFrom] = useState("Zebec balance")

  const {
    currentToken,
    setCurrentToken,
    show,
    toggle,
    setToggle,
    setValue,
    errors,
    register,
    handleSubmit,
    setError,
    trigger
  } = useWithdrawDepositForm({
    tokens: tokenDetails,
    type: "deposit"
  })

  const submit = (data: { amount: string }) => {
    if (
      (depositFrom === "Wallet" &&
        Number(data.amount) > getBalance(walletBalance, currentToken.symbol)) ||
      (depositFrom === "Zebec balance" &&
        Number(data.amount) > getBalance(zebecBalance, currentToken.symbol))
    ) {
      setError(
        "amount",
        { type: "custom", message: "validations:deposit-max-amount" },
        { shouldFocus: true }
      )
      return
    }
    // handle deposit
  }

  useClickOutside(dropdownWrapper, {
    onClickOutside: () => {
      setToggleDropdown(false)
    }
  })

  const setMaxAmount = () => {
    if (depositFrom === "Wallet") {
      setValue(
        "amount",
        getBalance(walletBalance, currentToken.symbol).toString()
      )
    } else if (depositFrom === "Zebec balance") {
      setValue(
        "amount",
        getBalance(zebecBalance, currentToken.symbol).toString()
      )
    }
    trigger("amount")
  }
  const [showTreasuryList, setShowTreasuryList] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [treasury, setTreasury] = useState({})

  return (
    <>
      <p className="leading-4 text-xs font-normal text-content-contrast mb-[24px]">
        {t("dca:add-funds-description")}
      </p>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col"
        autoComplete="off"
      >
        <div className="relative" ref={dropdownWrapper}>
          <label className={`text-content-secondary text-xs font-medium mb-1`}>
            {t("dca:add-fund-from")}
          </label>
          <div
            onClick={() => setToggleDropdown(!toggleDropdown)}
            className="cursor-pointer relative text-content-primary"
          >
            <input
              type="text"
              value={depositFrom}
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
              {!showTreasuryList &&
                ["Wallet", "Zebec balance", "Treasury"].map((item) => (
                  <div
                    key={item}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (item === "Treasury") {
                        setShowTreasuryList(true)
                      } else {
                        setDepositFrom(item)
                        setToggleDropdown(false)
                      }
                    }}
                    className={`border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light`}
                  >
                    <div
                      className={twMerge(
                        "text-sm  flex justify-between",
                        item === depositFrom ||
                          (depositFrom.includes("Treasury") &&
                            item === "Treasury")
                          ? "text-primary"
                          : "text-content-primary",
                        item === "Treasury" ? "relative" : ""
                      )}
                    >
                      {depositFrom.includes("Treasury") && item === "Treasury"
                        ? depositFrom
                        : item}{" "}
                      <div className="flex gap-3">
                        {item === depositFrom && <Icons.CheckIcon />}
                        {item === "Treasury" && (
                          <>
                            <Icons.CheveronDownIcon className="text-content-primary -rotate-90" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {showTreasuryList && (
                <div className="py-[17px]">
                  <div
                    onClick={() => {
                      setShowTreasuryList(false)
                    }}
                    className="flex px-[17px] items-center mb-2 gap-[18.52px] cursor-pointer hover:text-primary"
                  >
                    <Icons.CheveronDownIcon className="rotate-90" /> All
                  </div>
                  {[
                    {
                      name: "Zebec Safe",
                      balance: 20000
                    },
                    {
                      name: "Kalpanik Treasury",
                      balance: 20000
                    }
                  ].map((item, index) => (
                    <div
                      key={item.name}
                      onClick={() => {
                        setTreasury(item)
                        setDepositFrom(`Treasury: ${item.name}`)
                        setShowTreasuryList(false)
                        setToggleDropdown(false)
                      }}
                      className="flex justify-between p-2.5 px-[17px]  hover:bg-background-light cursor-pointer"
                    >
                      <div
                        className={twMerge(
                          "flex text-body justify-start items-center gap-1.5",
                          depositFrom.includes(item.name) ? "text-primary" : ""
                        )}
                      >
                        <Image
                          src={Avatars[index % 3].src}
                          width={16}
                          height={16}
                          className="object-contain"
                          alt={`Avatar ${index + 1}`}
                        />
                        {item.name}
                      </div>
                      <div className="text-content-tertiary text-caption">
                        {formatCurrency(item.balance, "$", 2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapseDropdown>
        </div>
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          {...register("amount")}
          errorMessage={`${errors.amount?.message || ""}`}
          disabled={!depositFrom}
          className="mt-4"
        >
          {/* Tokens Dropdown */}
          <TokensDropdown
            walletTokens={
              depositFrom === "Wallet"
                ? walletBalance
                : depositFrom === "Zebec balance"
                ? zebecBalance
                : []
            }
            tokens={tokenDetails}
            show={show}
            toggleShow={setToggle}
            setCurrentToken={setCurrentToken}
          />
        </WithdrawDepositInput>
        <Button
          title={`${t("dca:buttons.deposit")}`}
          variant="gradient"
          className="w-full mt-6"
        />
      </form>
    </>
  )
}
