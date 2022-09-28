import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { withdrawFromTreasury } from "application"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import { useContext, useState } from "react"
import { getBalance } from "utils/getBalance"

export const Withdrawal = () => {
  const { t } = useTranslation()
  const { publicKey } = useWallet()
  const { treasury, treasuryToken } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const [loading, setLoading] = useState(false)

  const {
    currentToken,
    setCurrentToken,
    show,
    toggle,
    setToggle,
    errors,
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    reset
  } = useWithdrawDepositForm({
    tokens: tokenDetails,
    type: "withdraw"
  })

  const withdrawCallback = (message: "success" | "error") => {
    if (message === "success") {
      reset()
    }
    setLoading(false)
  }

  const submitWitdrawal = (data: { amount: string }) => {
    if (Number(data.amount) > getBalance(treasuryTokens, currentToken.symbol)) {
      setError(
        "amount",
        { type: "custom", message: "validation:max" },
        { shouldFocus: true }
      )
      return
    } else {
      setLoading(true)
      const withdrawData = {
        sender: (publicKey as PublicKey).toString(),
        safe_address: activeTreasury?.treasury_address || "",
        safe_data_account: activeTreasury?.treasury_escrow || "",
        receiver: (publicKey as PublicKey).toString(),
        amount: Number(data.amount),
        token_mint_address:
          currentToken.symbol === "SOL" ? "" : currentToken.mint
      }
      if (!withdrawData.token_mint_address) {
        treasury &&
          dispatch(
            withdrawFromTreasury({
              data: withdrawData,
              treasury: treasury,
              callback: withdrawCallback
            })
          )
      } else {
        treasuryToken &&
          dispatch(
            withdrawFromTreasury({
              data: withdrawData,
              treasuryToken: treasuryToken,
              callback: withdrawCallback
            })
          )
      }
    }
    // handle withdrawal
  }

  const setMaxAmount = () => {
    setValue(
      "amount",
      getBalance(treasuryTokens, currentToken.symbol).toString()
    )
    trigger("amount")
  }

  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6 min-h-[260px]">
      <div className="text-caption text-content-tertiary">
        {t("treasuryOverview:withdraw-description")}
      </div>
      <form
        onSubmit={handleSubmit(submitWitdrawal)}
        className="flex flex-col gap-y-6"
      >
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          errorMessage={`${errors.amount?.message || ""}`}
          {...register("amount")}
        >
          {/* Tokens Dropdown */}
          <TokensDropdown
            walletTokens={treasuryTokens}
            tokens={tokenDetails}
            show={show}
            toggleShow={setToggle}
            setCurrentToken={setCurrentToken}
          />
        </WithdrawDepositInput>

        <Button
          title={`${t("treasuryOverview:withdraw")}`}
          variant="gradient"
          className="w-full"
          loading={loading}
          disabled={loading}
        />
      </form>
    </div>
  )
}
