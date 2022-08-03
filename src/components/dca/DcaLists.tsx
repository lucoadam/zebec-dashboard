import { ArrowDownIcon, CalenderIcon, RefreshIcon } from "assets/icons"
import { IconButton } from "components/shared"
import { Token } from "components/shared/Token"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { FC } from "react"
import { formatCurrency } from "utils"

//fakeData
import { dcaLists } from "fakedata"

const DcaLists: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dcaLists.map((dca, index) => {
          return (
            <Link key={index} href={`/dca/${dca.token0}-${dca.token1}`}>
              <div className="p-6 pb-8 bg-background-secondary rounded cursor-pointer">
                <div className="flex flex-col">
                  <div className="relative flex items-center text-base text-content-primary font-semibold">
                    <div className="w-12">
                      <IconButton
                        className="absolute top-0 left-0 h-6 w-6 p-[2px]"
                        icon={
                          <Token
                            symbol={dca.token0}
                            className="text-content-primary"
                          />
                        }
                      />
                      <IconButton
                        className="absolute top-0 left-3.5 h-6 w-6 p-[2px]"
                        icon={
                          <Token
                            symbol={dca.token1}
                            className="text-content-primary"
                          />
                        }
                      />
                    </div>
                    {dca.token0}/{dca.token1}
                  </div>
                  <div className="mt-4 text-heading-3 text-content-primary font-semibold">
                    {formatCurrency(dca.balance, "$", 2)}
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-content-primary">
                    <Token
                      symbol={dca.token0}
                      className="text-content-primary w-4 h-4"
                    />
                    <span>
                      {formatCurrency(
                        dca.token0AmountChange < 0
                          ? -1 * dca.token0AmountChange
                          : dca.token0AmountChange,
                        dca.token0AmountChange < 0 ? "-$" : "+$"
                      )}{" "}
                    </span>
                    <div
                      className={`flex items-center ${
                        dca.token0AmountChange < 0
                          ? "text-error"
                          : "text-success"
                      }`}
                    >
                      {dca.token0AmountChange < 0 ? (
                        <ArrowDownIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 transform -rotate-180" />
                      )}
                      {dca.token0PercentageChange < 0
                        ? dca.token0PercentageChange * -1
                        : dca.token0PercentageChange}
                      %{" "}
                    </div>
                    /
                    <Token
                      symbol={dca.token1}
                      className="text-content-primary w-4 h-4"
                    />
                    <span>
                      {formatCurrency(
                        dca.token1AmountChange < 0
                          ? -1 * dca.token1AmountChange
                          : dca.token1AmountChange,
                        dca.token1AmountChange < 0 ? "-$" : "+$"
                      )}{" "}
                    </span>
                    <div
                      className={`flex items-center ${
                        dca.token1AmountChange < 0
                          ? "text-error"
                          : "text-success"
                      }`}
                    >
                      {dca.token1AmountChange < 0 ? (
                        <ArrowDownIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 transform -rotate-180" />
                      )}
                      {dca.token1PercentageChange < 0
                        ? dca.token1PercentageChange * -1
                        : dca.token1PercentageChange}
                      %{" "}
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-md text-content-primary">
                  <div className="flex gap-[6px] items-center">
                    <CalenderIcon className="h-4 w-4" />
                    {t("dca:next")}: {dca.next}
                  </div>
                  <div className="ml-3 gap-[6px] flex items-center">
                    <RefreshIcon className="h-4 w-4" />
                    {dca.refresh}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default DcaLists
