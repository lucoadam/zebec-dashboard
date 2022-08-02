import * as Yup from "yup"
import { amount } from "./commonSchema"

export const addLiquiditySchema = Yup.object().shape({
  amount0: amount.amount,
  amount1: amount.amount,
  slippage: Yup.string()
    .required()
    .test("not-negative", "", (value) => Number(value) > 0)
})
