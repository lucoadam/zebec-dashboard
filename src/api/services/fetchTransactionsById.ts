import { constants } from "constants/constants"
import { fetchOutgoingTransactionsById } from "features/transactions/transactionsSlice"
export const fetchTransactionsById =
  (uuid: string) => async (dispatch: any) => {
    localStorage.setItem("transaction_features_initiated", "true")

    await dispatch(fetchOutgoingTransactionsById(uuid))
    setTimeout(async () => {
      await dispatch(fetchOutgoingTransactionsById(uuid))
      localStorage.setItem("transaction_features_initiated", "false")
    }, constants.STREAM_FETCH_TIMEOUT)

    return null
  }
