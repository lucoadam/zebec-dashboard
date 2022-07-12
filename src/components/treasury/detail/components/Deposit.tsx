/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useToggle } from "hooks"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { getBalance } from "utils/getBalance"

export const Deposit = () => {
  const { t } = useTranslation()

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
