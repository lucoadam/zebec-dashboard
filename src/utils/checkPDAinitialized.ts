import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { connection } from "constants/cluster"
import { constants } from "constants/constants"

export const checkPDAinitialized = async (pda: string) => {
  const balance = await connection.getBalance(new PublicKey(pda))
  return {
    balance,
    isBalanceRequired:
      balance < constants.MIN_SOL_BALANCE_IN_SOLANA_ACCOUNT * LAMPORTS_PER_SOL
  }
}
