import * as Yup from "yup"
import { nftaddress, transactionName, wallet } from "./commonSchema"

export const sendNFTSchema = Yup.object().shape({
  ...transactionName,
  nftAddress: nftaddress.wallet,
  receiver: wallet.wallet
})
