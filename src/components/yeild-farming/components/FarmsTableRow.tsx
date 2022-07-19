import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, IconButton } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, Fragment, useEffect } from "react"
import ReactTooltip from "react-tooltip"
import { formatCurrency, getTokenImage } from "utils"

interface FarmsTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liquidity: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
}

const returnValidPercentage = (percentage: number) => {
  if (percentage > 0) {
    return percentage
  } else {
    return 0
  }
}

const FarmsTableRow: FC<FarmsTableRowProps> = ({
  index,
  liquidity,
  activeDetailsRow,
  handleToggleRow
}) => {
  const { t } = useTranslation("transactions")

  const { tokens: tokenDetails } = useAppSelector((state) => state.tokenDetails)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex items-center`}>
          <td className="px-6 py-4 min-w-59.5">
            <div className="flex items-center gap-x-2.5 text-base font-semibold text-content-primary">
              <div className="grid place-content-center w-7 h-7 bg-background-primary rounded-lg">
                <img
                  className="w-4 h-4 text-lg"
                  src={getTokenImage(tokenDetails, liquidity.baseToken)}
                  alt={liquidity.baseToken}
                />
              </div>
              <div className="grid place-content-center w-7 h-7 bg-background-primary rounded-lg">
                <img
                  className="w-4 h-4 text-lg"
                  src={getTokenImage(tokenDetails, liquidity.mintToken)}
                  alt={liquidity.baseToken}
                />
              </div>
              {`${liquidity.baseToken}-${liquidity.mintToken}`}
            </div>
          </td>
          <td className="px-6 py-4 min-w-39.4">
            <div className="text-caption text-content-primary">-</div>
          </td>
          <td className="px-6 py-4 min-w-39.4">
            <div className="text-caption text-content-primary">-</div>
          </td>
          <td className="px-6 py-4 min-w-39.4">
            <div className="text-caption text-content-primary">
              ~{liquidity.apy}%
            </div>
          </td>
          <td className="px-6 py-4 min-w-39.4">
            <div className="text-caption text-content-primary">
              <div className="flex flex-col gap-y-1 text-content-contrast">
                <div className="flex items-center text-subtitle-sm font-medium">
                  <span className="text-subtitle text-content-primary font-semibold">
                    {formatCurrency(liquidity.tvl, "$")}
                  </span>
                </div>
                <div className="text-caption">
                  {formatCurrency(liquidity.tvl)} LP
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 w-full float-right">
            <div className="flex items-center float-right gap-x-6">
              <Button
                title="Add Liquidity"
                size="small"
                startIcon={
                  <Icons.PlusIncircleIcon className="text-content-contrast" />
                }
              />
              <IconButton
                variant="plain"
                icon={<Icons.CheveronDownIcon />}
                onClick={handleToggleRow}
              />
            </div>
          </td>
        </tr>
        {/* Table Body Details Row */}
        <tr>
          <td colSpan={4}>
            <div
              className={`bg-background-light rounded-lg overflow-y-auto  transition-all duration-[400ms] ${
                activeDetailsRow === index ? `ease-in h-max` : "ease-out h-0"
              }`}
              //style={styles.detailsRow}
            >
              <div className="pt-4 pr-12 pb-6 pl-6">
                <div className="flex gap-x-24 py-6 text-subtitle-sm font-medium">
                  {/* Left Column */}
                  <div className="flex flex-col gap-y-4">
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.deposited")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        -
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Button
                        startIcon={<Icons.PlusIncircleIcon />}
                        title={`${t("yeildFarming:add-liquidity")}`}
                        variant="gradient"
                      />
                      <Button
                        startIcon={<Icons.LockIcon />}
                        className="text-content-primary"
                        title={`${t("yeildFarming:stake")}`}
                        disabled
                      />
                      <Button
                        className="text-content-primary"
                        startIcon={<Icons.ArrowDownLeft />}
                        title={`${t("yeildFarming:unstake")}`}
                        disabled
                      />
                    </div>
                  </div>
                  {/* Right Column */}

                  <div className="flex flex-col gap-y-4">
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.pending-rewards")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        -
                      </div>
                    </div>
                    <div>
                      <Button
                        startIcon={<Icons.ArrowDownLeft />}
                        className="text-content-primary"
                        title={`${t("yeildFarming:harvest")}`}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </Fragment>
    </>
  )
}

export default FarmsTableRow
