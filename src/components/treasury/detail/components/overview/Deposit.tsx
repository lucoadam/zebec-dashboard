/* eslint-disable @next/next/no-img-element */
import * as Icons from "assets/icons"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { depositToTreasury } from "application"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { constants } from "constants/constants"
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import { useContext } from "react"
import { useState } from "react"
import { getBalance } from "utils/getBalance"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"

export const Deposit = () => {
  const { t } = useTranslation()
  const { publicKey } = useWallet()
  const { treasury, treasuryToken } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const zebecBalance =
    useAppSelector((state) => state.zebecBalance.tokens) || []
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const zebecStreamingTokens =
    useAppSelector((state) => state.zebecStreamingBalance.tokens) || []

  const [loading, setLoading] = useState(false)
  const [showMaxInfo, setShowMaxInfo] = useState<boolean>(false)

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

  const depositCallback = (message: "success" | "error") => {
    if (message === "success") {
      reset()
      setTimeout(() => {
        dispatch(
          fetchTreasuryBalance({
            name: activeTreasury?.name,
            address: activeTreasury?.treasury_address,
            network: "solana"
          })
        )
        dispatch(
          fetchZebecBalance({
            publicKey: publicKey?.toString(),
            network: "solana"
          })
        )
      }, constants.BALANCE_FETCH_TIMEOUT)
    }
    setLoading(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = (data: any) => {
    if (Number(data.amount) > getBalance(zebecBalance, currentToken.symbol)) {
      setError(
        "amount",
        { type: "custom", message: "validation:max" },
        { shouldFocus: true }
      )
      return
    } else {
      setLoading(true)
      const depositData = {
        sender: (publicKey as PublicKey).toString(),
        safe_address: activeTreasury?.treasury_address || "",
        amount: Number(data.amount),
        token_mint_address:
          currentToken.symbol === "SOL" ? "" : currentToken.mint
      }
      if (!depositData.token_mint_address) {
        treasury &&
          dispatch(
            depositToTreasury({
              data: depositData,
              treasury: treasury,
              callback: depositCallback
            })
          )
      } else {
        treasuryToken &&
          dispatch(
            depositToTreasury({
              data: depositData,
              treasury: treasuryToken,
              callback: depositCallback
            })
          )
      }
    }
    // handle deposit
  }

  const setMaxAmount = () => {
    const balance =
      getBalance(zebecBalance, currentToken.symbol) -
      getBalance(zebecStreamingTokens, currentToken.symbol)

    if (getBalance(zebecStreamingTokens, currentToken.symbol) > 0) {
      setShowMaxInfo(true)
    } else {
      setShowMaxInfo(false)
    }

    setValue("amount", balance.toString())
    trigger("amount")
  }

  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6 min-h-[260px]">
      <div className="text-caption text-content-tertiary">
        {t("treasuryOverview:deposit-description")}
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col"
        autoComplete="off"
      >
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          {...register("amount")}
          errorMessage={`${errors.amount?.message || ""}`}
        >
          {/* Tokens Dropdown */}
          <TokensDropdown
            walletTokens={zebecBalance || []}
            tokens={tokenDetails}
            show={show}
            toggleShow={setToggle}
            setCurrentToken={setCurrentToken}
          />
        </WithdrawDepositInput>

        {showMaxInfo && (
          <div className="mt-2 text-caption text-content-tertiary flex items-start gap-x-1">
            <Icons.InformationIcon className="w-5 h-5 flex-shrink-0" />
            <span>{t("common:deposit-withdrawal.max-withdraw-message")}</span>
          </div>
        )}

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
