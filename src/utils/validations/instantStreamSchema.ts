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
  ...transactionName,
  showRemarks: toggle.toggle,
  receiverWallet: wallet.wallet,
  ...remarks,
  ...token,
  ...amount,
  ...file
})
