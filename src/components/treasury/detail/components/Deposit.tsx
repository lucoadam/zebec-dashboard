/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"

export const Deposit = () => {
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const walletTokens =
    useAppSelector((state) => state.zebecBalance.tokens) || []

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
    balanceTokens: walletTokens,
    tokens: tokenDetails,
    type: "deposit"
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = (data: any) => {
    console.log(data)
  }

  return (
    <>
      <p className="leading-4 text-xs font-normal text-content-contrast mb-[24px]">
        {t("treasuryOverview:deposit-description")}
      </p>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-y-6">
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          {...register("amount")}
          errorMessage={`${errors.amount?.message}`}
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
          title={t("treasuryOverview:deposit")}
          variant="gradient"
          className="w-full"
        />
      </form>
    </>
  )
}
