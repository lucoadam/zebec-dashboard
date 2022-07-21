import { useAppSelector } from "app/hooks"
import BigNumber from "bignumber.js"
import { Button } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import { AmountFieldProps } from "./AmountField.d"

export const AmountField: FC<AmountFieldProps> = ({
  tokenSymbol,
  tokens,
  register,
  setValue,
  name,
  error
}) => {
  const { t } = useTranslation()
  const [currentToken, setCurrentToken] = useState({
    symbol: "",
    image: ""
  })
  const walletBalance = useAppSelector((state) => state.walletBalance.tokens)

  useEffect(() => {
    if (tokens.length > 0) {
      const token = tokens.find((token) => token.symbol === tokenSymbol)
      setCurrentToken({
        symbol: token?.symbol || "",
        image: token?.image || ""
      })
    }
  }, [tokens, tokenSymbol])

  return (
    <div>
      <div className="flex justify-between">
        <label className="ml-3 text-content-secondary text-xs font-medium mb-1">
          {currentToken.symbol}
        </label>
        <label className={`text-content-tertiary text-xs font-normal mb-1`}>
          {t("send:balance")}{" "}
          {walletBalance.find((token) => token.symbol === currentToken.symbol)
            ?.balance || 0}{" "}
          {currentToken.symbol}
        </label>
      </div>
      <div className="relative text-content-primary">
        {currentToken.image && (
          <img
            className="w-[18px] h-[18px] absolute top-3 left-5 text-lg"
            src={currentToken.image}
            alt={currentToken.symbol}
          />
        )}
        <input
          type="number"
          step="any"
          className={`h-[40px] w-[258px] !pl-11 !pr-[106px] ${
            error && "error"
          }`}
          {...register(name)}
        />
        <div className="flex gap-1 absolute right-2 top-2">
          <Button
            size="small"
            title={`MAX`}
            className=" text-content-primary"
            onClick={() => {
              setValue(
                name,
                new BigNumber(
                  walletBalance.find(
                    (token) => token.symbol === currentToken.symbol
                  )?.balance || 0
                ).toString()
              )
            }}
            type="button"
          />
          <Button
            size="small"
            title={`HALF`}
            className="text-content-primary"
            onClick={() => {
              setValue(
                name,
                new BigNumber(
                  walletBalance.find(
                    (token) => token.symbol === currentToken.symbol
                  )?.balance || 0
                )
                  .div(2)
                  .toString()
              )
            }}
            type="button"
          />
        </div>
      </div>
      {error && (
        <p className="text-content-secondary text-xs ml-[12px] mt-1">
          {t(error)}
        </p>
      )}
    </div>
  )
}
