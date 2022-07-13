import { DepositedTokenAssets } from "components/shared"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC } from "react"

const DepositedAssets: FC<{
  tokens?: TokenDetails[]
  balanceTokens?: TreasuryToken[]
  tableMaxHeight?: number
}> = ({ tokens = [], balanceTokens = [], tableMaxHeight = 402 }) => {
  return (
    <>
      <DepositedTokenAssets
        balanceTokens={balanceTokens}
        tokens={tokens}
        tableMaxHeight={tableMaxHeight}
      />
    </>
  )
}

export default DepositedAssets
