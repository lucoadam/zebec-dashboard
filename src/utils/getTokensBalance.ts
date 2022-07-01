import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { connection } from "constants/cluster";
import { TokenDetails } from "./../features/tokenDetails/tokenDetailsSlice.d";

export const getTokensBalanceOfWallet = async (
  wallet: String,
  tokens: TokenDetails[]
) => {
  const tokensMint = tokens.map((token) => token.mint);
  const accounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(wallet),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );
  const tokensBalance = Object.fromEntries(
    accounts.value
      .filter((account) =>
        tokensMint.includes(account.account.data.parsed.info.mint)
      )
      .map((account) => [
        account.account.data.parsed.info.mint,
        account.account.data.parsed.info.tokenAmount.uiAmount,
      ])
  );
  return tokensBalance;
};
