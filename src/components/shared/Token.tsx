import { TokenIcons } from "assets/icons"
import { FC } from "react"

export type TokenSymbol = keyof typeof TokenIcons
export interface TokenProps {
  symbol: string
  className?: string
}

export const Token: FC<TokenProps> = ({ symbol, className = "" }) => {
  if (!TokenIcons[symbol as TokenSymbol]) {
    return null
  }
  const TokenIcon = TokenIcons[symbol as TokenSymbol]
  return <TokenIcon className={className} />
}
