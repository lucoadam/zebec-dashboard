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
  transaction_name: transactionName.transactionName,
  showRemarks: toggle.toggle,
  receiver: wallet.wallet,
  ...remarks,
  symbol: token.token,
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
