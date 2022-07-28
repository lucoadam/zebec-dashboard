import { ZebecNativeStreamProps } from "./stream.d"
import { sendContinuousStream } from "features/stream/streamSlice"
import { fetchOutgoingTransactions } from "features/transactions/transactionsSlice"
import { toast } from "features/toasts/toastsSlice"

export const initStreamNative =
  (data: any, stream: ZebecNativeStreamProps) => async (dispatch: any) => {
    const response = await stream.init(data)

    if (response.status.toLocaleLowerCase() === "success") {
      dispatch(
        toast.success({
          message: response.message ?? "Transaction Success",
          transactionHash: response?.data?.transactionHash
        })
      )
      const dataWithPda = {
        ...data,
        pda: response?.data?.pda,
        transactionHash: response?.data?.transactionHash
      }
      dispatch(sendContinuousStream(dataWithPda))
      dispatch(fetchOutgoingTransactions(data.sender))
    } else {
      dispatch(
        toast.error({
          message: response.message ?? "Unknown Error"
        })
      )
    }

    return null
  }
