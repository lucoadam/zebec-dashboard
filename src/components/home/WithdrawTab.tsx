import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { getBalance } from "utils/getBalance"

const WithdrawTab: FC = () => {
  const { t } = useTranslation()
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const walletTokens =
    useAppSelector((state) => state.zebecBalance.tokens) || []

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
    setError
  } = useWithdrawDepositForm({
    tokens: tokenDetails,
    type: "withdraw"
  })
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
    }
  }

  const setMaxAmount = () => {
    setValue("amount", getBalance(walletTokens, currentToken.symbol))
    trigger("amount")
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
        />
      </form>
    </div>
  )
}

export default WithdrawTab
