import { PublicKey } from "@solana/web3.js"
import { connection } from "constants/cluster"

export const checkPDAinitialized = async (pda: string) => {
  const balance = await connection.getBalance(new PublicKey(pda))
  console.log("balance", balance)
  return balance > 0
}
