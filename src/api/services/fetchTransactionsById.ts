import { constants } from "constants/constants"
import {
  fetchOutgoingTransactionsById,
  removeInitiatedTransactions,
  setInitiatedTransactions
} from "features/transactions/transactionsSlice"
import {
  fetchTreasuryVaultContinuousTransactionsById,
  removeInitiatedTreasuryTransactions,
  setInitiatedTreasuryTransactions
} from "features/treasuryTransactions/treasuryTransactionsSlice"

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

export const fetchTreasuryVaultTransactionsById =
  (treasury_uuid: string, uuid: string, type: "pause" | "resume" | "cancel") =>
  async (dispatch: any) => {
    if (type === "resume") dispatch(removeInitiatedTreasuryTransactions(uuid))
    else dispatch(setInitiatedTreasuryTransactions(uuid))

    setTimeout(async () => {
      await dispatch(
        fetchTreasuryVaultContinuousTransactionsById({
          treasury_uuid: treasury_uuid,
          uuid: uuid
        })
      )
    }, constants.STREAM_FETCH_TIMEOUT)

    return null
  }
