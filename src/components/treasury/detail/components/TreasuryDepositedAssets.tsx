import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC, useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import { TreasuryTokenAssets } from "./TreasuryTokenAssets"
import { TreasuryVaultTokenAssets } from "./TreasuryVaultTokenAssets"

export const TreasuryDepositedAssets: FC<{
  tokens?: TokenDetails[]
  balanceTokens?: TreasuryToken[]
  vaultBalanceTokens?: TreasuryToken[]
  streamingBalanceTokens?: TreasuryToken[]
  tableMaxHeight?: number
}> = ({
  tokens = [],
  balanceTokens = [],
  vaultBalanceTokens = [],
  streamingBalanceTokens = [],
  tableMaxHeight = 402
}) => {
  const { t } = useTranslation("treasuryOverview")
  const [activeTab, setActiveTab] = useState<number>(0)

  const tabs = [
    {
      title: "treasury-assets",
      Component: (
        <TreasuryTokenAssets
          balanceTokens={balanceTokens}
          tokens={tokens}
          tableMaxHeight={tableMaxHeight}
          className="deposited-assets"
        />
      )
    },
    {
      title: "treasury-vault-assets",
      Component: (
        <TreasuryVaultTokenAssets
          balanceTokens={vaultBalanceTokens}
          streamingBalanceTokens={streamingBalanceTokens}
          tokens={tokens}
          tableMaxHeight={tableMaxHeight}
          className="deposited-assets"
        />
      )
    }
  ]

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [balanceTokens])

  return (
    <>
      <div className="rounded bg-background-secondary flex flex-col">
        <div className="flex items-center border-b border-outline pt-2">
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={tab.title}
                type="plain"
                title={`${t(tab.title)}`}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
                className="w-1/2 justify-center"
              />
            )
          })}
        </div>
        {/* Active Tab */}
        {tabs[activeTab].Component}
      </div>
    </>
  )
}
