import { ZebecNativeStreamProps } from "./stream.d"
import { sendContinuousStream } from "features/stream/streamSlice"
import { toast } from "features/toasts/toastsSlice"

export const initStreamNative =
  (data: any, stream: ZebecNativeStreamProps) => async (dispatch: any) => {
    const response = await stream.init(data)

    console.log(`response`, response)
    if (response.status.toLocaleLowerCase() === "success") {
      dispatch(
        toast.success({
          message: response.message ?? "Transaction Success",
          transactionHash: response?.data?.transactionHash
        })
      )
      const dataWithPda = {
        ...data,
        pda: response?.data?.pda
      }
      dispatch(sendContinuousStream(dataWithPda))
    } else {
      dispatch(
        toast.error({
          message: response.message ?? "Unknown Error"
        })
      )
    }

    return null
  }
