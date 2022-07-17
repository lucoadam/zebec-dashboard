import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"

export const Withdrawal = () => {
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []

  const {
    currentToken,
    setCurrentToken,
    //change
    t,
    //toggle
    show,
    toggle,
    setToggle,
    //max value
    setMaxAmount,
    //useForm
    errors,
    register,
    handleSubmit
  } = useWithdrawDepositForm({
    balanceTokens: treasuryTokens,
    tokens: tokenDetails,
    type: "withdraw"
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitWitdrawal = (data: any) => {
    // submitted withdrawal
    console.log("data", JSON.stringify(data, null, 2))
  }

  return (
    <>
      <p className="leading-4 text-xs font-normal text-content-contrast mb-6">
        {t("treasuryOverview:withdraw-description")}
      </p>
      <form
        onSubmit={handleSubmit(submitWitdrawal)}
        className="flex flex-col gap-y-6"
      >
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          errorMessage={`${errors.amount?.message}`}
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
        />
      </form>
    </>
  )
}
