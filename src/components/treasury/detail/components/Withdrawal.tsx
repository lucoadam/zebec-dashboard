import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useToggle } from "hooks"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { getBalance } from "utils/getBalance"

export const Withdrawal = () => {
  const { t } = useTranslation()

  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  const [currentToken, setCurrentToken] = useState<{
    symbol: string
    image: string
  }>(
    tokenDetails[0] || {
      symbol: "",
      image: ""
    }
  )

  useEffect(() => {
    if (tokenDetails.length > 0) {
      setCurrentToken(tokenDetails[0])
    }
  }, [tokenDetails])

  const [show, toggle, setToggle] = useToggle(false)

  const setMaxAmount = () =>
    setValue(
      "amount",
      getBalance(treasuryTokens, currentToken.symbol).toString()
    )

  const { register, setValue, handleSubmit } = useForm()

  const submitWitdrawal = (data: any) => {
    console.log(data)
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
          title={t("treasuryOverview:withdraw")}
          variant="gradient"
          className="w-full"
        />
      </form>
    </>
  )
}
