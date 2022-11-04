import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { TreasuryBalance } from "./TreasuryBalance"
import { TreasuryVaultBalance } from "./TreasuryVaultBalance"
import { TreasuryDepositedAssets } from "./TreasuryDepositedAssets"
import {
  ActivityThisWeek,
  DepositWithdraw,
  SupportCardComponents,
  Tokens
} from "components/shared"
import { useState } from "react"
import { Deposit } from "./Deposit"
import { Withdrawal } from "./Withdrawal"
import { PendingConfirmation } from "./PendingConfirmation"
import { useZebecWallet } from "hooks/useWallet"

const fundTransferTabs = [
  {
    title: "common:buttons.deposit",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <Deposit />
  },
  {
    title: "common:buttons.withdraw",
    icon: <Icons.ArrowUpRightIcon />,
    count: 0,
    Component: <Withdrawal />
  }
]

const Overview = () => {
  const walletObject = useZebecWallet()
  const tokenDetails = useAppSelector((state) =>
    state.tokenDetails.tokens.filter(
      (token) =>
        token.chainId === walletObject.chainId &&
        token.network === walletObject.network
    )
  )
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  const treasuryVaultTokens =
    useAppSelector((state) => state.treasuryVaultBalance.treasury?.tokens) || []
  const treasuryVaultStreamingTokensBalance =
    useAppSelector((state) => state.treasuryStreamingBalance?.tokens) || []
  const [currentToken, setCurrentToken] = useState("SOL")
  const treasuryBalance = useAppSelector(
    (state) => state.treasuryBalance.treasury?.tokens
  )
  const treasuryVaultBalance = useAppSelector(
    (state) => state.treasuryVaultBalance.treasury?.tokens
  )
  const prices = useAppSelector((state) => state.tokenDetails.prices)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/**
       * First Column
       *    1. Safe Balance
       *    2. Incoming/ Outgoing
       *    3. Activity this Week
       */}
      <div className="grid gap-y-6">
        {/**
         * Treasury Balance
         */}
        <TreasuryBalance
          balance={treasuryBalance?.reduce(
            (a, b) => a + (prices[b.symbol] * b.balance || 0),
            0
          )}
        />
        {/* Treasury Vault Balance */}
        <TreasuryVaultBalance
          balance={treasuryVaultBalance?.reduce(
            (a, b) => a + (prices[b.symbol] * b.balance || 0),
            0
          )}
        />
        {/**
         * Incoming/ Outgoing
         */}
        <Tokens currentToken={currentToken} setCurrentToken={setCurrentToken} />
        {/**
         * Activity this week
         */}
        <ActivityThisWeek currentToken={currentToken} />
      </div>
      {/**
       * Second Column
       *   1. Deposited Assets
       * **/}
      <div className="grid gap-y-6">
        <TreasuryDepositedAssets
          balanceTokens={treasuryTokens}
          vaultBalanceTokens={treasuryVaultTokens}
          streamingBalanceTokens={treasuryVaultStreamingTokensBalance}
          tokens={tokenDetails}
        />
        {/**
         * Zebec Treasury Help
         */}
        <SupportCardComponents.ZebecHelp page="treasury" />
        <SupportCardComponents.SendFeedback />
      </div>
      <div className="flex flex-col gap-y-6">
        <DepositWithdraw tabs={fundTransferTabs} />
        <PendingConfirmation />
      </div>
    </div>
  )
}

export default Overview
