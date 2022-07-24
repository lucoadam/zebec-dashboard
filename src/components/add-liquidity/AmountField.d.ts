import { AddLiquidityFormData } from "pages/farming/add-liquidity"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"

interface AmountFieldProps {
  tokenSymbol: string
  tokens: TokenDetails[]
  register: UseFormRegister<AddLiquidityFormData>
  setValue: UseFormSetValue<AddLiquidityFormData>
  name: "amount0" | "amount1"
  error?: string
}
