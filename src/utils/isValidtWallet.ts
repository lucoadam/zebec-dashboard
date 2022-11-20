import { utils } from "ethers"
import { PublicKey } from "@solana/web3.js"

export const isValidWallet = (
  value: string | undefined,
  chainId = "solana"
) => {
  if (chainId === "solana") {
    try {
      return PublicKey.isOnCurve(value || "")
    } catch (e) {
      return false
    }
  } else {
    return utils.isAddress(value || "")
  }
}
