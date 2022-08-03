import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { getBalance } from "utils/getBalance"

const DepositTab: FC = () => {
  const { t } = useTranslation()
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const walletTokens =
    useAppSelector((state) => state.walletBalance.tokens) || []
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

  const setMaxAmount = () => {
    setValue("amount", getBalance(walletTokens, currentToken.symbol))
    trigger("amount")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = (data: any) => {
    if (Number(data.amount) > getBalance(walletTokens, currentToken.symbol)) {
      setError(
        "amount",
        { type: "custom", message: "transactions:deposit.max-amount" },
        { shouldFocus: true }
      )
      return
    }
    // on deposited
  }

  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        {t("common:deposit-withdrawal.deposit-title")}
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-6"
        autoComplete="off"
      >
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
          title={`${t("common:buttons.deposit")}`}
          variant="gradient"
          className="w-full"
        />
      </form>
    </div>
  )
}

export default DepositTab
