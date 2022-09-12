import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC, useState } from "react"
import { formatCurrency } from "utils"
import { getBalance, getUsdBalance } from "utils/getBalance"
import { Token } from "components/shared"
import { twMerge } from "tailwind-merge"
import { useTranslation } from "next-i18next"

interface DepositedTokenAssetsProps {
  tableMaxHeight: number
  tokens: TokenDetails[]
  balanceTokens: TreasuryToken[]
  streamingBalanceTokens: TreasuryToken[]
  className?: string
}

export const TreasuryTokenAssets: FC<DepositedTokenAssetsProps> = (props) => {
  const { t } = useTranslation("common")

  const { tableMaxHeight, tokens, balanceTokens, className } = props
  const tokensPrice = useAppSelector((state) => state.tokenDetails.prices)

  const [search, setSearch] = useState("")

  const filterTokens = () => {
    if (search !== "")
      return tokens.filter(
        (item) =>
          item.symbol.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase())
      )
    return tokens
  }

  return (
    <>
      <div className={twMerge("p-6 h-full", className)}>
        <div className="flex flex-col gap-y-6">
          {/* Assets Table */}
          <div className="w-full border border-outline  bg-background-primary overflow-hidden rounded-md">
            <div className="flex items-center px-4.5 border-b border-outline">
              <Icons.SearchIcon className="text-base text-content-tertiary flex-shrink-0" />

              <input
                className="!rounded-b-none !border-0 !ring-0 !text-body !text-content-secondary"
                value={search}
                placeholder={`${t("deposited-assets.search-token")}`}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                type="text"
              />
            </div>
          </div>
          <div
            className="flex flex-col overflow-hidden"
            style={{ maxHeight: tableMaxHeight, minHeight: "300px" }}
          >
            <div className="overflow-auto">
              <table className="w-full">
                <tbody className="w-full border-separate">
                  {/* SOL */}
                  {filterTokens().length > 0 &&
                    filterTokens().map((token) => (
                      <tr key={token.symbol} className="">
                        <td className="whitespace-nowrap pb-5">
                          <div className="flex items-center gap-x-2">
                            <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary">
                              <Token
                                symbol={token.symbol}
                                className="w-5 h-5"
                              />
                            </div>
                            <div className="text-caption text-content-primary">
                              {token.symbol}
                            </div>
                          </div>
                        </td>
                        <td className="pl-4 pb-5">
                          <div className="flex flex-col items-end">
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
                                data-tip={getBalance(
                                  balanceTokens,
                                  token.symbol
                                )}
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
                      </tr>
                    ))}
                  {filterTokens().length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-3 text-content-contrast text-center"
                      >
                        <Icons.EmptyStateIllustrator className="w-60 h-28 mx-auto mb-4 mt-8" />
                        {t("deposited-assets.no-tokens-found")}
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
