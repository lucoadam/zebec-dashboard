/* eslint-disable @next/next/no-img-element */
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { depositToTreasury } from "application"
import * as Icons from "assets/icons"
import {
  Button,
  CollapseDropdown,
  TokensDropdown,
  WithdrawDepositInput
} from "components/shared"
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice"
import { useClickOutside } from "hooks"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import { useContext } from "react"
import { useRef, useState } from "react"
import { getBalance } from "utils/getBalance"

export const Deposit = () => {
  const { t } = useTranslation()
  const { publicKey } = useWallet()
  const { treasury } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const zebecBalance =
    useAppSelector((state) => state.zebecBalance.tokens) || []
  const walletBalance =
    useAppSelector((state) => state.walletBalance.tokens) || []
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const dropdownWrapper = useRef(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [depositFrom, setDepositFrom] = useState("Zebec balance")
  const [loading, setLoading] = useState(false)

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
    trigger,
    reset
  } = useWithdrawDepositForm({
    tokens: tokenDetails,
    type: "deposit"
  })

  const depositCallback = () => {
    reset()
    setLoading(false)
    setTimeout(() => {
      dispatch(fetchTreasuryBalance())
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = (data: any) => {
    if (
      (depositFrom === "Wallet" &&
        Number(data.amount) > getBalance(walletBalance, currentToken.symbol)) ||
      (depositFrom === "Zebec balance" &&
        Number(data.amount) > getBalance(zebecBalance, currentToken.symbol))
    ) {
      setError(
        "amount",
        { type: "custom", message: "transactions:deposit.max-amount" },
        { shouldFocus: true }
      )
      return
    } else {
      setLoading(true)
      const depositData = {
        sender: (publicKey as PublicKey).toString(),
        safe_address: activeTreasury?.treasury_address || "",
        amount: data.amount,
        token_mint_address:
          currentToken.symbol === "SOL" ? "" : currentToken.mint
      }
      treasury &&
        dispatch(
          depositToTreasury({
            data: depositData,
            treasury: treasury,
            callback: depositCallback
          })
        )
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
      setValue("amount", getBalance(walletBalance, currentToken.symbol))
    } else if (depositFrom === "Zebec balance") {
      setValue("amount", getBalance(zebecBalance, currentToken.symbol))
    }
    trigger("amount")
  }

  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        {t("treasuryOverview:deposit-description")}
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col"
        autoComplete="off"
      >
        <div className="relative" ref={dropdownWrapper}>
          <label className={`text-content-secondary text-xs font-medium mb-1`}>
            Deposit From
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
              {["Wallet", "Zebec balance"].map((item) => (
                <div
                  key={item}
                  onClick={(event) => {
                    event.stopPropagation()
                    setToggleDropdown(false)
                    setDepositFrom(item)
                  }}
                  className={`border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light`}
                >
                  <div className="text-sm text-content-primary">{item}</div>
                </div>
              ))}
            </div>
          </CollapseDropdown>
        </div>
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          {...register("amount")}
          errorMessage={`${errors.amount?.message?.toString() || ""}`}
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
          title={`${t("treasuryOverview:deposit")}`}
          variant="gradient"
          className="w-full mt-6"
          loading={loading}
          disabled={loading}
        />
      </form>
    </div>
  )
}
