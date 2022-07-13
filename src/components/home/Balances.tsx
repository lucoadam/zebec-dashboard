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
  return (
    <>
      {/* Deposited Balance */}
      <DepositedBalance />
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
