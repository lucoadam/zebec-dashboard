import { FC, useContext, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useTranslation } from "next-i18next"
import { useAppSelector, useAppDispatch } from "app/hooks"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { getBalance } from "utils/getBalance"
import { withdrawNative, withdrawToken } from "application"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import ZebecContext from "app/zebecContext"
import { PublicKey } from "@solana/web3.js"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"

const WithdrawTab: FC = () => {
  const { t } = useTranslation()
  const { stream, token } = useContext(ZebecContext)
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const walletTokens =
    useAppSelector((state) => state.zebecBalance.tokens) || []

  const [loading, setLoading] = useState<boolean>(false)

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

  const setMaxAmount = () => {
    setValue("amount", getBalance(walletTokens, currentToken.symbol))
    trigger("amount")
  }

  const withdrawCallback = () => {
    reset()
    setTimeout(() => {
      dispatch(fetchZebecBalance(publicKey?.toString()))
      dispatch(fetchWalletBalance(publicKey?.toString()))
    }, 15000)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = (data: any) => {
    // on withdrawal form submit
    if (Number(data.amount) > getBalance(walletTokens, currentToken.symbol)) {
      setError(
        "amount",
        { type: "custom", message: "transactions:deposit.max-amount" },
        { shouldFocus: true }
      )
      return
    } else {
      setLoading(true)
      const withdrawData = {
        sender: (publicKey as PublicKey).toString(),
        amount: +data.amount,
        token_mint_address:
          currentToken.symbol === "SOL" ? "" : currentToken.mint
      }
      console.log(withdrawData)
      if (currentToken.symbol === "SOL")
        stream && dispatch(withdrawNative(withdrawData, stream, setLoading, withdrawCallback))
      else token && dispatch(withdrawToken(withdrawData, token, setLoading, withdrawCallback))
    }
  }

  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        {t("common:deposit-withdrawal.withdraw-title")}
      </div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-y-6">
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          {...register("amount")}
          errorMessage={`${errors.amount?.message?.toString() || ""}`}
        >
          {/* Tokens Dropdown */}
          <TokensDropdown
            walletTokens={walletTokens}
            tokens={tokenDetails}
            show={show}
            toggleShow={setToggle}
            setCurrentToken={setCurrentToken}
          />
        </WithdrawDepositInput>

        <Button
          title={`${t("common:buttons.withdraw")}`}
          variant="gradient"
          className="w-full"
          disabled={loading}
          loading={loading}
        />
      </form>
    </div>
  )
}

export default WithdrawTab
