import * as Yup from "yup"
import { names, uniqueName, uniqueWallet, wallets } from "./commonSchema"

export const addOwnersSchema = Yup.object().shape({
  ...wallets,
  ...names,
  ...uniqueName,
  ...uniqueWallet
})
