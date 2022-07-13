import * as Icons from "assets/icons"
import { useClickOutside } from "hooks"
import React, { FC, useRef } from "react"
import { Button } from "./Button"

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
      //handle clicking outside
      useClickOutside(tokensDropdownWrapperRef, {
        onClickOutside: () => setToggle(false)
      })

      return (
        <>
          <div className={className}>
            <label>Token</label>
            <div
              ref={tokensDropdownWrapperRef}
              className="pl-4.5 pr-6 flex items-center bg-background-primary border border-outline rounded-lg relative"
            >
              <div
                className="flex flex-grow-0 items-center gap-x-1.5 cursor-pointer"
                onClick={toggle}
              >
                {/* Icons here */}
                <div className="grid place-content-center w-5 h-5 bg-background-primary rounded-full">
                  {token?.image && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-4 h-4  text-content-primary"
                        src={token.image}
                        alt={token.symbol}
                      />
                    </>
                  )}
                </div>
                <div className="flex items-center text-body text-content-primary">
                  {token?.symbol ?? "SOL"}{" "}
                  <Icons.CheveronDownIcon className="text-base text-content-secondary" />
                </div>
              </div>
              <div className="relative w-full flex items-center">
                <div>
                  <input
                    type="text"
                    className="!pl-4 !text-body !leading-6 !border-none !focus:outline-0 !ring-0 w-full"
                    placeholder="Enter Amount"
                    {...rest}
                    ref={ref}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setMaxAmount()
                  }}
                  title="MAX"
                  size="small"
                  className="right-px top-0"
                />
              </div>

              {/* Tokens Dropdown Children */}
              {children}
            </div>
            {errorMessage &&
              errorMessage !== "" &&
              errorMessage !== "undefined" && (
                <p className="text-content-secondary text-xs ml-[12px] mt-1">
                  {errorMessage}
                </p>
              )}
          </div>
        </>
      )
    }
  )

WithdrawDepositInput.displayName = "WithdrawDepositInput"
