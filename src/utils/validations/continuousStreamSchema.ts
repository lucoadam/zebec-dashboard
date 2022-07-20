import * as Yup from "yup"
import {
  amount,
  endDate,
  endTime,
  file,
  interval,
  noOfTimes,
  remarks,
  startDate,
  startTime,
  toggle,
  token,
  tokenAmount,
  transactionName,
  wallet
} from "./commonSchema"

export const continuousSchema = Yup.object().shape({
  ...transactionName,
  showRemarks: toggle.toggle,
  receiverWallet: wallet.wallet,
  ...remarks,
  ...token,
  ...amount,
  ...startDate,
  ...endDate,
  ...startTime,
  ...endTime,
  enableStreamRate: toggle.toggle,
  ...noOfTimes,
  ...tokenAmount,
  ...interval,
  ...file
})
