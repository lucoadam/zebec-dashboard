import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export const formatLamports = (value: number, token_mint_address: string) => {
  if (token_mint_address) {
    return value
  }
  return value / LAMPORTS_PER_SOL
}
