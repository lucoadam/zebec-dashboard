import { yupResolver } from "@hookform/resolvers/yup"
import { useAppSelector } from "app/hooks"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useToggle } from "hooks"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { getBalance } from "utils/getBalance"
import * as Yup from "yup"

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

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(t("transactions:withdraw.enter-withdraw-amount"))
      .test(
        "is-not-zero",
        t("transactions:withdraw.not-zero"),
        (value) => typeof value === "string" && parseFloat(value) > 0
      )
      .test(
        "is-not-zero",
        t("transactions:withdraw.max-amount"),
        (value) =>
          typeof value === "string" &&
          parseFloat(value) <= getBalance(treasuryTokens, currentToken.symbol)
      )
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onChange" || "onSubmit",
    resolver: yupResolver(validationSchema)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          title={t("treasuryOverview:withdraw")}
          variant="gradient"
          className="w-full"
        />
      </form>
    </>
  )
}
