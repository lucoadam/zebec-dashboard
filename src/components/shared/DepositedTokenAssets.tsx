import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC, useState } from "react"
import { formatCurrency } from "utils"
import { getBalance, getUsdBalance } from "utils/getBalance"
import { Token } from "./Token"
import { twMerge } from "tailwind-merge"
import { useTranslation } from "next-i18next"

interface DepositedTokenAssetsProps {
  tableMaxHeight: number
  tokens: TokenDetails[]
  balanceTokens: TreasuryToken[]
  className?: string
}

export const DepositedTokenAssets: FC<DepositedTokenAssetsProps> = (props) => {
  const { t } = useTranslation()

  const { tableMaxHeight, tokens, balanceTokens, className } = props
  const tokensPrice = useAppSelector((state) => state.tokenDetails.prices)

  const [search, setSearch] = useState("")

  const filterTokens = () => {
    if (search !== "")
      return tokens.filter((item) => item.symbol.toLowerCase().includes(search))
    return tokens
  }

  return (
    <>
      <div
        className={twMerge(
          "p-6 rounded bg-background-secondary h-full",
          className
        )}
      >
        <div className="flex flex-col gap-y-6">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            DEPOSITED ASSETS
          </div>
          {/* Assets Table */}
          <div className="w-full border border-outline  bg-background-primary overflow-hidden rounded-md">
            <div className="flex items-center px-4.5 border-b border-outline">
              <Icons.SearchIcon className="text-base text-content-tertiary" />

              <input
                className="!rounded-b-none !border-0 !ring-0 !text-body !text-content-secondary"
                value={search}
                placeholder="Search token"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                type="text"
              />
            </div>
          </div>
          <div
            className="flex flex-col gap-y-8 overflow-hidden"
            style={{ maxHeight: tableMaxHeight }}
          >
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0">
                  <tr className="bg-background-secondary">
                    <td className="pb-3"></td>
                    <td className="pl-4 text-left text-caption text-content-contrast pb-3">
                      Balance
                    </td>
                    <td className="pl-4 pr-1.5 text-left text-caption text-content-contrast pb-3">
                      Streaming
                    </td>
                  </tr>
                </thead>
                <tbody className="w-full border-separate">
                  {/* SOL */}
                  {filterTokens().map((token) => (
                    <tr key={token.symbol} className="">
                      <td className="whitespace-nowrap w-[1%] pb-6 pt-3">
                        <div className="flex flex-col items-center gap-y-1">
                          <div className="w-8 h-8 grid place-content-center rounded-full bg-background-primary">
                            <Token symbol={token.symbol} className="w-5 h-5" />
                          </div>
                          <div className="text-caption text-content-primary">
                            {token.symbol}
                          </div>
                        </div>
                      </td>
                      <td className="pl-4 pb-6 pt-3">
                        <div className="flex flex-col gap-y-2 mt-1">
                          <div className=" text-subtitle-sm text-content-primary font-medium">
                            <span
                              data-tip={formatCurrency(
                                getUsdBalance(
                                  tokensPrice,
                                  balanceTokens,
                                  token.symbol
                                ),
                                "$"
                              )}
                            >
                              {formatCurrency(
                                getUsdBalance(
                                  tokensPrice,
                                  balanceTokens,
                                  token.symbol
                                ),
                                "$"
                              )}
                            </span>
                          </div>
                          <div className=" text-caption text-content-contrast">
                            <span
                              data-tip={getBalance(balanceTokens, token.symbol)}
                            >
                              {formatCurrency(
                                getBalance(balanceTokens, token.symbol),
                                "",
                                4
                              )}
                            </span>{" "}
                            {token.symbol}
                          </div>
                        </div>
                      </td>
                      <td className="pl-4 pr-1.5 pb-6 pt-3">
                        <div className="flex flex-col gap-y-2 mt-1">
                          <div className=" text-subtitle-sm text-content-primary font-medium">
                            <span
                              data-tip={getUsdBalance(
                                tokensPrice,
                                balanceTokens,
                                token.symbol
                              )}
                            >
                              {formatCurrency(
                                getUsdBalance(
                                  tokensPrice,
                                  balanceTokens,
                                  token.symbol
                                ),
                                "$"
                              )}
                            </span>
                          </div>
                          <div className=" text-caption text-content-contrast">
                            <span
                              data-tip={getBalance(balanceTokens, token.symbol)}
                            >
                              {formatCurrency(
                                getBalance(balanceTokens, token.symbol)
                              )}{" "}
                            </span>
                            {token.symbol}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filterTokens().length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-3 text-content-contrast"
                      >
                        {t("common:no-coins-found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
