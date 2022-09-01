import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { connection } from "constants/cluster"

export const formatLamportsToAmount = async (
  lamports: string,
  token_mint_address?: string
) => {
  const lamportsInNum = Number(lamports)
  let amount: number
  if (token_mint_address) {
    const tokenMetaData = await connection.getTokenSupply(
      new PublicKey(token_mint_address)
    )
    const decimals = tokenMetaData.value.decimals
    amount = lamportsInNum * Math.pow(10, decimals)
  } else {
    amount = lamportsInNum / LAMPORTS_PER_SOL
  }
  return amount
}
