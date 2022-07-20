import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"

export const getTokenImage = (tokenDetails: TokenDetails[], symbol: string) => {
  if (tokenDetails.some((token) => token.symbol === symbol)) {
    return tokenDetails.find((token) => token.symbol === symbol)?.image
  }
  return ""
}
