import { DepositedTokenAssets } from "components/shared"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC } from "react"

const DepositedAssets: FC<{
  tokens?: TokenDetails[]
  balanceTokens?: TreasuryToken[]
}> = ({ tokens = [], balanceTokens = [] }) => {
  return (
    <>
      <DepositedTokenAssets
        balanceTokens={balanceTokens}
        tokens={tokens}
        tableMaxHeight={424}
      />
    </>
  )
}

export default DepositedAssets
