import * as Yup from "yup"
import { withdrawAmount } from "./commonSchema"

export const withdrawAmountSchema = Yup.object().shape({
  ...withdrawAmount
})
