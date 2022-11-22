import { getAssociatedTokenAddress } from "@solana/spl-token"
import { PublicKey } from "@solana/web3.js"
import { connection } from "constants/cluster"

export const checkTokenAccountCreated = async (
  targetTokenAddress: string,
  recipientAddress: string
) => {
  const recipientTokenAddress = await getAssociatedTokenAddress(
    new PublicKey(targetTokenAddress),
    new PublicKey(recipientAddress),
    true
  )
  const receipientTokenAccountInfo = await connection.getAccountInfo(
    recipientTokenAddress,
    "confirmed"
  )
  return !!receipientTokenAccountInfo
}
