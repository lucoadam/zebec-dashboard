import { constants } from "constants/constants"
import {
  fetchOutgoingTransactionsById,
  removeInitiatedTransactions,
  setInitiatedTransactions
} from "features/transactions/transactionsSlice"
export const fetchTransactionsById =
  (uuid: string, type: "pause" | "resume" | "cancel") =>
  async (dispatch: any) => {
    await dispatch(fetchOutgoingTransactionsById(uuid))

    //Initiated transactions
    if (type === "resume") dispatch(removeInitiatedTransactions(uuid))
    else dispatch(setInitiatedTransactions(uuid))

    setTimeout(async () => {
      await dispatch(fetchOutgoingTransactionsById(uuid))
    }, constants.STREAM_FETCH_TIMEOUT)

    return null
  }
