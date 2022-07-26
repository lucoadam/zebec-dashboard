import * as Yup from "yup"
import {
  amount,
  file,
  remarks,
  toggle,
  token,
  transactionName,
  wallet
} from "./commonSchema"

export const instantStreamSchema = Yup.object().shape({
  transaction_name: transactionName.transactionName,
  showRemarks: toggle.toggle,
  receiver: wallet.wallet,
  ...remarks,
  symbol: token.token,
  ...amount,
  ...file
})
