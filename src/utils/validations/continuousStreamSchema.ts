import * as Yup from "yup"
import {
  amount,
  chainId,
  endDate,
  endTime,
  file,
  interval,
  noOfTimes,
  receiverWallet,
  remarks,
  startDate,
  startTime,
  toggle,
  token,
  tokenAmount,
  transactionName
} from "./commonSchema"

export const continuousSchema = Yup.object().shape({
  transaction_name: transactionName.transactionName,
  showRemarks: toggle.toggle,
  ...receiverWallet,
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
  ...file,
  ...chainId
})
