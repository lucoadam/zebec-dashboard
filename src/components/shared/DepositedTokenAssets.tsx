import * as Icons from "assets/icons"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC, useState } from "react"
import { formatCurrency } from "utils"
import { getBalance, getUsdBalance } from "utils/getBalance"
import { InputField } from "./InputField"

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
      <div className="p-6 rounded bg-background-secondary h-full">
        <div className="flex flex-col gap-y-6">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            DEPOSITED ASSETS
          </div>
          {/* Assets Table */}
          <InputField className="h-9 relative" error={false}>
            <div>
              <Icons.SearchIcon className="absolute left-2.5 top-[11px] text-content-primary" />
              <input
                className="w-full h-9 !pl-8"
                value={search}
                placeholder="Search token"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                type="text"
              />
            </div>
          </InputField>
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
                          <div className="w-8 h-8 grid place-content-center rounded-lg bg-background-primary">
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
                              getBalance(balanceTokens, token.symbol),
                              "$"
                            )}
                          </div>
                          <div className=" text-caption text-content-contrast">
                            {formatCurrency(
                              getUsdBalance(balanceTokens, token.symbol)
                            )}{" "}
                            {token.symbol}
                          </div>
                        </div>
                      </td>
                      <td className="pl-4 pr-1.5 pb-6 pt-3">
                        <div className="flex flex-col gap-y-2 mt-1">
                          <div className=" text-subtitle-sm text-content-primary font-medium">
                            {formatCurrency(
                              getBalance(balanceTokens, token.symbol),
                              "$"
                            )}
                          </div>
                          <div className=" text-caption text-content-contrast">
                            {formatCurrency(
                              getUsdBalance(balanceTokens, token.symbol)
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
