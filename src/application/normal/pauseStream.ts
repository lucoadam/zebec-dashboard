/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ZebecNativeStream,
  ZebecTokenStream,
  MPauseResumeWithdrawCancel
} from "zebec-anchor-sdk-npmtest/packages/stream"
import {
  pauseTransaction,
  togglePauseModal
} from "features/modals/pauseModalSlice"
import { toast } from "features/toasts/toastsSlice"

export const pauseStreamNative: any =
  (data: MPauseResumeWithdrawCancel, uuid: string, stream: ZebecNativeStream) =>
  async (dispatch: any) => {
    try {
      const response = await stream.pause(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Pause Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        dispatch(pauseTransaction(uuid))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(togglePauseModal())
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(togglePauseModal())
    }
  }

export const pauseStreamToken: any =
  (data: MPauseResumeWithdrawCancel, uuid: string, token: ZebecTokenStream) =>
  async (dispatch: any) => {
    try {
      const response = await token.pause(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Pause Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        dispatch(pauseTransaction(uuid))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(togglePauseModal())
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(togglePauseModal())
    }
  }
