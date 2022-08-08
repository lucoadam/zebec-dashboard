import * as Icons from "assets/icons"
import BigNumber from "bignumber.js"
import { Button, TokensDropdown } from "components/shared"
import { Token } from "components/shared/Token"
import { useClickOutside } from "hooks"
import { useTranslation } from "next-i18next"
import { FC, useRef, useState } from "react"
import { AmountFieldProps } from "./AmountField.d"

export const AmountField: FC<AmountFieldProps> = ({
  tokens,
  register,
  setValue,
  walletBalance = [],
  name,
  error,
  disabled,
  currentToken,
  setCurrentToken
}) => {
  const { t } = useTranslation()

  const [toggle, setToggle] = useState(false)

  const tokensDropdownWrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside(tokensDropdownWrapperRef, {
    onClickOutside: () => setToggle(false)
  })

  return (
    <div>
      <div
        ref={tokensDropdownWrapperRef}
        className="relative text-content-primary"
      >
        {currentToken?.symbol && (
          <div
            className="cursor-pointer absolute top-3 left-5 flex text-content-primary gap-1.5"
            onClick={() => {
              if (!disabled) setToggle((prev) => !prev)
            }}
          >
            {/* Icons here */}
            {currentToken?.symbol && (
              <Token
                symbol={currentToken.symbol}
                className="w-4 h-4 text-content-primary"
              />
            )}
            <span
              className={`${
                disabled ? "text-content-tertiary" : "text-content-primary"
              }`}
            >
              {currentToken?.symbol ?? "SOL"}{" "}
            </span>
            <Icons.CheveronDownIcon className="text-base text-content-secondary" />
          </div>
        )}
        <input
          type="number"
          step="any"
          placeholder={t("createDCA:form.enter-amount")}
          className={`h-[40px] w-full !pl-28 !pr-[106px] ${error && "error"}`}
          {...register(name)}
        />
        <div className="flex gap-1 absolute right-2 top-2">
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
        </div>
        <TokensDropdown
          show={toggle}
          tokens={tokens}
          setCurrentToken={(token) => setCurrentToken(token)}
          toggleShow={setToggle}
        />
      </div>
      {error && (
        <p className="text-content-secondary text-xs ml-[12px] mt-1">
          {t(error)}
        </p>
      )}
    </div>
  )
}
