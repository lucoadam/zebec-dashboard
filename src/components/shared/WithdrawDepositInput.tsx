import * as Icons from "assets/icons"
import { useClickOutside } from "hooks"
import { useTranslation } from "next-i18next"
import React, { FC, useRef } from "react"
import { Button } from "./Button"
import { Token } from "./Token"

interface Token {
  symbol: string
  image: string
}

interface WithdrawDepositInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode
  setMaxAmount: () => void
  toggle: () => void
  setToggle: (arg0: false) => void
  className?: string
  token?: Token
  errorMessage?: string
}

export const WithdrawDepositInput: FC<WithdrawDepositInputProps> =
  React.forwardRef<HTMLInputElement, WithdrawDepositInputProps>(
    (
      props: WithdrawDepositInputProps,
      ref: React.ForwardedRef<HTMLInputElement>
    ): JSX.Element => {
      const {
        children,
        toggle,
        setToggle,
        setMaxAmount,
        token,
        className,
        errorMessage = "",
        ...rest
      } = props

      const tokensDropdownWrapperRef = useRef<HTMLDivElement>(null)
      const { t } = useTranslation()
      //handle clicking outside
      useClickOutside(tokensDropdownWrapperRef, {
        onClickOutside: () => setToggle(false)
      })

      return (
        <>
          <div className={className}>
            <label
              className={`${
                props.disabled
                  ? "text-content-tertiary"
                  : "text-content-secondary"
              }`}
            >
              {" "}
              {t("common:balances.token")}
            </label>
            <div ref={tokensDropdownWrapperRef} className="relative">
              <div
                className="cursor-pointer absolute top-3 left-5 flex items-center text-content-primary gap-1.5"
                onClick={() => {
                  if (!props.disabled) toggle()
                }}
              >
                {/* Icons here */}
                {token?.symbol && (
                  <Token
                    symbol={token.symbol}
                    className="w-4 h-4 text-content-primary"
                  />
                )}
                <span
                  className={`${
                    props.disabled
                      ? "text-content-tertiary"
                      : "text-content-primary"
                  }`}
                >
                  {token?.symbol ?? "SOL"}{" "}
                </span>
                <Icons.CheveronDownIcon className="text-base text-content-secondary w-4 h-4" />
              </div>
              <div className="w-full flex items-center">
                <input
                  type="number"
                  step={"any"}
                  className={`!pl-[115px] !pr-14 w-full h-[40px] ${
                    errorMessage && "error"
                  }`}
                  placeholder="Enter Amount"
                  {...rest}
                  ref={ref}
                  autoComplete="off"
                  onKeyDown={(event) => {
                    const regex = new RegExp(
                      /(^\d*\.?\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/
                    )
                    return !event.key.match(regex) && event.preventDefault()
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    setMaxAmount()
                  }}
                  title={`${t("common:buttons.max")}`}
                  size="small"
                  className={`absolute right-2 top-2 ${
                    props.disabled
                      ? "text-content-tertiary"
                      : "text-content-primary"
                  }`}
                />
              </div>

              {/* Tokens Dropdown Children */}
              {children}
            </div>
            {errorMessage &&
              errorMessage !== "" &&
              errorMessage !== "undefined" && (
                <p className="text-error text-xs ml-3 mt-1">
                  {t(errorMessage)}
                </p>
              )}
          </div>
        </>
      )
    }
  )

WithdrawDepositInput.displayName = "WithdrawDepositInput"
