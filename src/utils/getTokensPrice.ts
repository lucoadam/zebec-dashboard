import axios from "axios"
import { TokenDetails } from "./../features/tokenDetails/tokenDetailsSlice.d"

export const getTokensUSDPrice = async (tokens: TokenDetails[]) => {
  const tokenIds = tokens
    .filter((token) => token.coingeckoId)
    .map((token) => token.coingeckoId)
    .toString()
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
  )
  const tokensPrice = tokens.map((token) => [
    token.mint,
    data[token.coingeckoId]?.usd
  ])
  return Object.fromEntries(tokensPrice)
}
