import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC, useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import { TreasuryTokenAssets } from "components/treasury/detail/components/overview/TreasuryTokenAssets"
import { TreasuryVaultTokenAssets } from "components/treasury/detail/components/overview/TreasuryVaultTokenAssets"

export const EVMDepositedAssets: FC<{
  tokens?: TokenDetails[]
  balanceTokens?: TreasuryToken[]
  pdaBalanceTokens?: TreasuryToken[]
  streamingBalanceTokens?: TreasuryToken[]
  tableMaxHeight?: number
}> = ({
  tokens = [],
  balanceTokens = [],
  pdaBalanceTokens = [],
  streamingBalanceTokens = [],
  tableMaxHeight = 402
}) => {
  const { t } = useTranslation("treasuryOverview")
  const [activeTab, setActiveTab] = useState<number>(0)

  const tabs = [
    {
      title: "home:zebec-assets",
      Component: (
        <TreasuryVaultTokenAssets
          balanceTokens={balanceTokens}
          streamingBalanceTokens={streamingBalanceTokens}
          tokens={tokens}
          tableMaxHeight={tableMaxHeight}
          className="deposited-assets"
        />
      )
    },
    {
      title: "home:pda-assets",
      Component: (
        <TreasuryTokenAssets
          balanceTokens={pdaBalanceTokens}
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
      <div className="rounded bg-background-secondary flex flex-col h-full">
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
