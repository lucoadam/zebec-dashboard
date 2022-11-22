import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { connection } from "constants/cluster"

export const checkPDAinitialized = async (pda: string) => {
  const balance = await connection.getBalance(new PublicKey(pda))
  return {
    balance,
    isBalanceRequired: balance < 0.003 * LAMPORTS_PER_SOL
  }
}
