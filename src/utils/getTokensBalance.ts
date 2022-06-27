
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection } from "constants/cluster";


export const getTokensBalanceOfWallet = async (wallet: String) => {
  const accounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(wallet),
    {
      programId: TOKEN_PROGRAM_ID,
    },
  );
  const tokensBalance = Object.fromEntries(accounts.value.map((account) => [
    account.account.data.parsed.info.mint,
    account.account.data.parsed.info.tokenAmount.uiAmount,
  ]));
  return tokensBalance;
}