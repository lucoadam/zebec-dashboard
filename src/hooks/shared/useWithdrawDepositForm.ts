import { yupResolver } from "@hookform/resolvers/yup"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { WalletToken } from "features/walletBalance/walletBalanceSlice.d"
import { useToggle } from "hooks/useToggle"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { getBalance } from "utils/getBalance"
import * as Yup from "yup"

interface UseWithdrawDepositFormOptions {
  balanceTokens: WalletToken[]
  tokens: TokenDetails[]
  type?: "deposit" | "withdraw"
}

export const useWithdrawDepositForm = ({
  tokens,
  balanceTokens,
  type = "deposit"
}: UseWithdrawDepositFormOptions) => {
  const { t } = useTranslation()
  const [currentToken, setCurrentToken] = useState<{
    symbol: string
    image: string
  }>(
    tokens[0] || {
      symbol: "",
      image: ""
    }
  )

  useEffect(() => {
    if (tokens.length > 0) {
      setCurrentToken(tokens[0])
    }
  }, [tokens])

  const [show, toggle, setToggle] = useToggle(false)

  const setMaxAmount = () =>
    setValue(
      "amount",
      getBalance(balanceTokens, currentToken.symbol).toString()
    )

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(t(`transactions:${type}.enter-${type}-amount`))
      .test(
        "is-not-zero",
        t(`transactions:${type}.not-zero`),
        (value) => typeof value === "string" && parseFloat(value) > 0
      )
      .test(
        "is-not-zero",
        t(`transactions:${type}.max-amount`),
        (value) =>
          typeof value === "string" &&
          parseFloat(value) <= getBalance(balanceTokens, currentToken.symbol)
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

  return {
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
  }
}
