import { ZebecNativeStreamProps, MPauseResumeWithdrawCancel } from "./stream.d"
import { toast } from "features/toasts/toastsSlice"
import {
  // cancelTransaction,
  toggleCancelModal
} from "features/modals/cancelModalSlice"

export const cancelStreamNative =
  (data: MPauseResumeWithdrawCancel, stream: ZebecNativeStreamProps) =>
  async (dispatch: any) => {
    try {
      const response = await stream.cancel(data)
      console.log(response)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Cancel Success"
            // transactionHash: response?.data?.transactionHash
          })
        )
        // const backendData = {
        //   ...data,
        // }
        // dispatch(cancelTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
      dispatch(toggleCancelModal())
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleCancelModal())
    }
  }

export const cancelStreamToken =
  (data: MPauseResumeWithdrawCancel, token: ZebecNativeStreamProps) =>
  async (dispatch: any) => {
    try {
      const response = await token.cancel(data)
      console.log(response)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Cancel Success"
            // transactionHash: response?.data?.transactionHash
          })
        )
        // const backendData = {
        //   ...data,
        // }
        // dispatch(cancelTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
      dispatch(toggleCancelModal())
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleCancelModal())
    }
  }
