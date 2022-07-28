import * as Yup from "yup"
import { nftaddress, receiverWallet, transactionName } from "./commonSchema"

export const sendNFTSchema = Yup.object().shape({
  ...transactionName,
  nftAddress: nftaddress.wallet,
  receiver: receiverWallet.receiver
})
