/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  cancelTransaction,
  toggleCancelModal
} from "features/modals/cancelModalSlice"
import { toast } from "features/toasts/toastsSlice"
import { MPauseResumeWithdrawCancel, ZebecNativeStreamProps } from "./stream.d"

export const cancelStreamNative: any =
  (
    data: MPauseResumeWithdrawCancel,
    uuid: string,
    stream: ZebecNativeStreamProps
  ) =>
  async (dispatch: any) => {
    try {
      const response = await stream.cancel(data)
      console.log(response)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Cancel Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        dispatch(cancelTransaction(uuid))
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

export const cancelStreamToken: any =
  (
    data: MPauseResumeWithdrawCancel,
    uuid: string,
    token: ZebecNativeStreamProps
  ) =>
  async (dispatch: any) => {
    try {
      const response = await token.cancel(data)
      console.log(response)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Cancel Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        dispatch(cancelTransaction(uuid))
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
