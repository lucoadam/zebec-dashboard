import axios from "axios";
import { tokens } from "./../constants/tokens";

export const getZebecTokensUSDPrice = async () => {
  const tokenIds = tokens
    .filter((token) => token.coingeccoId)
    .map((token) => token.coingeccoId)
    .toString();
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
  );
  const tokensPrice = tokens.map((token) => [
    token.symbol,
    data[token.coingeccoId]?.usd,
  ]);
  return Object.fromEntries(tokensPrice);
};
