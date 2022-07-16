import { useAppSelector } from "app/hooks"
import {
  ActivityThisWeek,
  DepositedBalance,
  Tokens,
  TotalWithdrawableAmount
} from "components/shared"
import { tokenBalances, weeklyBalances } from "fakedata"
import { FC, useState } from "react"

const Balances: FC = () => {
  const [currentToken, setCurrentToken] = useState<
    keyof typeof tokenBalances | keyof typeof weeklyBalances
  >("SOL")
  const zebecBalance = useAppSelector((state) => state.zebecBalance.tokens)
  const { prices } = useAppSelector((state) => state.tokenDetails)
  return (
    <>
      {/* Deposited Balance */}
      <DepositedBalance
        balance={zebecBalance.reduce(
          (a, b) => a + (prices[b.symbol] * b.balance || 0),
          0
        )}
      />
      {/* Total Withdrawable Amount */}
      <TotalWithdrawableAmount />
      {/* Tokens */}
      <Tokens currentToken={currentToken} setCurrentToken={setCurrentToken} />
      {/* Activity This Week */}
      <ActivityThisWeek currentToken={currentToken} />
    </>
  )
}

export default Balances
