import { connection } from "constants/cluster"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

export const getSolBalanceOfWallet = async (wallet: String) => {
  const solBalance = await connection.getBalance(new PublicKey(wallet))
  return solBalance / LAMPORTS_PER_SOL
}
