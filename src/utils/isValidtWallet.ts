import { PublicKey } from "@solana/web3.js"

export const isValidWallet = (value: string | undefined) => {
  try {
    return PublicKey.isOnCurve(value || "")
  } catch (e) {
    return false
  }
}
