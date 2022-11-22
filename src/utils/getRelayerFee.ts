import { constants } from "constants/constants"

export async function getRelayerFee(tokenPriceInUsd: number): Promise<number> {
  const relayerFee = constants.RELAYER_FEE_IN_USD / tokenPriceInUsd
  return relayerFee || 0
}
