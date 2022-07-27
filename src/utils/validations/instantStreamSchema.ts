import * as Yup from "yup"
import {
  amount,
  file,
  receiverWallet,
  remarks,
  toggle,
  token,
  transactionName
} from "./commonSchema"

export const instantStreamSchema = Yup.object().shape({
  transaction_name: transactionName.transactionName,
  showRemarks: toggle.toggle,
  ...receiverWallet,
  ...remarks,
  symbol: token.token,
  ...amount,
  ...file
})
