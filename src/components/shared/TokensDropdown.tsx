import * as Icons from "assets/icons"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { WalletToken } from "features/walletBalance/walletBalanceSlice.d"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"
import { twMerge } from "tailwind-merge"
import { getBalance } from "utils/getBalance"
import { CollapseDropdown } from "./CollapseDropdown"
import { Token } from "./Token"

interface TokensDropdownProps {
  show: boolean
  className?: string
  tokens?: TokenDetails[]
  walletTokens?: WalletToken[]
  setCurrentToken?: (arg0: TokenDetails) => void
  toggleShow?: (arg0: boolean) => void
}

export const TokensDropdown: FC<TokensDropdownProps> = (props) => {
  const { t } = useTranslation()
  const [search, setSearchData] = useState("")
  const {
    show,
    className,
    tokens = [],
    walletTokens = [],
    toggleShow,
    setCurrentToken
  } = props
  return (
    <>
      {/* Tokens Dropdown */}
      <CollapseDropdown
        show={show}
        className={twMerge(
          `w-full border border-outline top-12 bg-background-primary z-10 `,
          className
        )}
      >
        <div className="rounded-lg">
          <div className="flex items-center px-4.5 py-3 border-b border-outline">
            <Icons.SearchIcon className="text-base text-content-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearchData(e.target.value)}
              placeholder="Search Tokens"
              className="!rounded-b-none !border-0 !ring-0 !text-body !text-content-secondary"
            />
          </div>
          <div className="flex flex-col divide-y divide-outline max-h-[206px] overflow-y-auto">
            {/* SOL */}
            {tokens
              .filter(
                (token) =>
                  token.name.toLowerCase().includes(search.toLowerCase()) ||
                  token.symbol.toLowerCase().includes(search.toLowerCase())
              )
              .map((token) => (
                <div
                  key={token.symbol}
                  onClick={() => {
                    if (setCurrentToken && toggleShow) {
                      setCurrentToken(token)
                      toggleShow(false)
                    }
                  }}
                  aria-disabled
                  className="px-3.5 py-4 flex items-center gap-x-2.5 transition hover:bg-background-tertiary"
                >
                  <div className="grid place-content-center w-7 h-7 rounded-full bg-background-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Token
                      symbol={token.symbol}
                      className="w-4 h-4 text-content-primary"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-body text-content-primary">
                      {token.symbol}
                    </div>
                    <div className="text-caption text-content-contrast">
                      {token.name}
                    </div>
                  </div>
                  <div className="text-caption text-content-secondary ml-auto">
                    {getBalance(walletTokens, token.symbol)} {token.symbol}
                  </div>
                </div>
              ))}
            {tokens.filter(
              (token) =>
                token.name.toLowerCase().includes(search.toLowerCase()) ||
                token.symbol.toLowerCase().includes(search.toLowerCase())
            ).length === 0 && (
              <div className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center">
                <div className="text-content-contrast">
                  {t("common:no-coins-found")}
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapseDropdown>
    </>
  )
}
