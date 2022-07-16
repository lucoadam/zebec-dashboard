import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { FC } from "react"

const DepositTab: FC = () => {
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const walletTokens =
    useAppSelector((state) => state.walletBalance.tokens) || []
  const {
    currentToken,
    setCurrentToken,
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
    type: "withdraw"
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = (data: any) => {
    console.log(data)
  }

  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        Deposit balance into your wallet.
      </div>
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
        <Button title="Deposit" variant="gradient" className="w-full" />
      </form>
    </div>
  )
}

export default DepositTab
