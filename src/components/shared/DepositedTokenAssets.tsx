import * as Icons from "assets/icons"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC, useState } from "react"
import { formatCurrency } from "utils"
import { getBalance, getUsdBalance } from "utils/getBalance"

interface DepositedTokenAssetsProps {
  tableMaxHeight: number
  tokens: TokenDetails[]
  balanceTokens: TreasuryToken[]
}

export const DepositedTokenAssets: FC<DepositedTokenAssetsProps> = (props) => {
  const { tableMaxHeight, tokens, balanceTokens } = props
  const [search, setSearch] = useState("")

  const filterTokens = () => {
    if (search !== "")
      return tokens.filter((item) => item.symbol.toLowerCase().includes(search))
    return tokens
  }

  return (
    <>
      <div className="p-6 rounded bg-background-secondary">
        <div className="flex flex-col gap-y-6">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            DEPOSITED ASSETS
          </div>
          {/* Assets Table */}
          <div className="w-full border border-outline  bg-background-primary overflow-hidden">
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
                            <img
                              className="w-5 h-5"
                              src={token.image}
                              alt={token.symbol}
                            />
                          </div>
                          <div className="text-caption text-content-primary">
                            {token.symbol}
                          </div>
                        </div>
                      </td>
                      <td className="pl-4 pb-6 pt-3">
                        <div className="flex flex-col gap-y-2 mt-1">
                          <div className=" text-subtitle-sm text-content-primary font-medium">
                            {formatCurrency(
                              getUsdBalance(balanceTokens, token.symbol),
                              "$"
                            )}
                          </div>
                          <div
                            data-tip={getBalance(balanceTokens, token.symbol)}
                            className=" text-caption text-content-contrast"
                          >
                            {formatCurrency(
                              getBalance(balanceTokens, token.symbol)
                            )}{" "}
                            {token.symbol}
                          </div>
                        </div>
                      </td>
                      <td className="pl-4 pr-1.5 pb-6 pt-3">
                        <div className="flex flex-col gap-y-2 mt-1">
                          <div className=" text-subtitle-sm text-content-primary font-medium">
                            {formatCurrency(
                              getUsdBalance(balanceTokens, token.symbol),
                              "$"
                            )}
                          </div>
                          <div className=" text-caption text-content-contrast">
                            {formatCurrency(
                              getBalance(balanceTokens, token.symbol)
                            )}{" "}
                            {token.symbol}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
