import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { PublicKey } from "@solana/web3.js"
import { connection } from "constants/cluster"
import { TokenDetails } from "./../features/tokenDetails/tokenDetailsSlice.d"
import { getSolBalanceOfWallet } from "./getSolBalance"

export const getTokensBalanceOfWallet = async (
  wallet: string,
  tokens: TokenDetails[]
) => {
  const tokensMint = tokens.map((token) => token.mint)
  const accounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(wallet),
    {
      programId: TOKEN_PROGRAM_ID
    }
  )
  // commented console.log("accounts", accounts)
  const solBalance = await getSolBalanceOfWallet(wallet)
  const tokensBalance = Object.fromEntries([
    ["SOL", solBalance],
    ...accounts.value
      .filter((account) =>
        tokensMint.includes(account.account.data.parsed.info.mint)
      )
      .map((account) => [
        tokens.find(
          (token) => token.mint === account.account.data.parsed.info.mint
        )?.symbol,
        account.account.data.parsed.info.tokenAmount.uiAmount
      ])
  ])
  return tokensBalance
}
