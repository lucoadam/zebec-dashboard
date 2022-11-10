import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC, useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import { Tab } from "components/shared"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { TreasuryTokenAssets } from "./TreasuryTokenAssets"
import { TreasuryVaultTokenAssets } from "./TreasuryVaultTokenAssets"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { constants } from "constants/constants"
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { fetchTreasuryVaultBalance } from "features/treasuryBalance/treasuryVaultBalanceSlice"

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
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const [refreshClassName, setRefreshClassName] = useState({
    1: "",
    2: ""
  })

  const refreshBalance = (title: string) => {
    if (title === "treasury-assets") {
      setRefreshClassName((prev) => ({ ...prev, 1: "animate-spin" }))
      if (publicKey && refreshClassName[1] !== "animate-spin") {
        dispatch(
          fetchTreasuryBalance({
            name: activeTreasury?.name,
            address: activeTreasury?.treasury_address
          })
        )
        dispatch(fetchZebecBalance(publicKey?.toString()))
      }
      setTimeout(() => {
        setRefreshClassName((prev) => ({ ...prev, 1: "" }))
      }, constants.REFRESH_ANIMATION_DURATION)
    } else {
      setRefreshClassName((prev) => ({ ...prev, 2: "animate-spin" }))
      if (publicKey && refreshClassName[2] !== "animate-spin") {
        dispatch(
          fetchTreasuryVaultBalance({
            name: activeTreasury?.name,
            address: activeTreasury?.treasury_vault_address
          })
        )
      }
      setTimeout(() => {
        setRefreshClassName((prev) => ({ ...prev, 2: "" }))
      }, constants.REFRESH_ANIMATION_DURATION)
    }
  }

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
                endIcon={
                  <span
                    className="w-7 h-7"
                    onClick={() => refreshBalance(tab.title)}
                  >
                    <Icons.RefreshIcon
                      className={
                        refreshClassName[(index + 1) as 1 | 2] as string
                      }
                    />
                  </span>
                }
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
