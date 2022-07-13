import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useToggle } from "hooks"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { getBalance } from "utils/getBalance"

const WithdrawTab: FC = () => {
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const walletTokens =
    useAppSelector((state) => state.zebecBalance.tokens) || []
  const [currentToken, setCurrentToken] = useState(
    tokenDetails[0] || {
      symbol: "",
      image: ""
    }
  )

  const { register, setValue, handleSubmit } = useForm()

  const setMaxAmount = () => {
    setValue("amount", getBalance(walletTokens, currentToken.symbol).toString())
  }

  useEffect(() => {
    if (tokenDetails.length > 0) {
      setCurrentToken(tokenDetails[0])
    }
  }, [tokenDetails])

  const [show, toggle, setToggle] = useToggle(false)

  const submit = (data: any) => {
    console.log(data)
  }
  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        Withdraw your deposited balance into your wallet.
      </div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-y-6">
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          {...register("amount")}
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
          title="Withdraw"
          variant="gradient"
          onClick={() => {}}
          className="w-full"
        />
      </form>
    </div>
  )
}

export default WithdrawTab
