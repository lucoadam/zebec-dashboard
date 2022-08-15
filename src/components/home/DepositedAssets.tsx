import { DepositedTokenAssets } from "components/shared"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { TreasuryToken } from "features/treasuryBalance/treasuryBalanceSlice.d"
import { FC, useEffect } from "react"
import ReactTooltip from "react-tooltip"

const DepositedAssets: FC<{
  tokens?: TokenDetails[]
  balanceTokens?: TreasuryToken[]
  tableMaxHeight?: number
}> = ({ tokens = [], balanceTokens = [], tableMaxHeight = 402 }) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [balanceTokens])
  return (
    <>
      <DepositedTokenAssets
        balanceTokens={balanceTokens}
        tokens={tokens}
        tableMaxHeight={tableMaxHeight}
        className="deposited-assets"
      />
    </>
  )
}

export default DepositedAssets
