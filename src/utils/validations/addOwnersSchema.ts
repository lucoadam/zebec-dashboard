import * as Yup from "yup"
import { name, wallet } from "./commonSchema"

export const addOwnersSchema = Yup.object().shape({
  ...name,
  ...wallet
})
