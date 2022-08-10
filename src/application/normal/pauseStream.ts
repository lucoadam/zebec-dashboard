/* eslint-disable @typescript-eslint/no-explicit-any */
import { togglePauseModal } from "features/modals/pauseModalSlice"
import { toast } from "features/toasts/toastsSlice"
import { MPauseResumeWithdrawCancel, ZebecNativeStreamProps } from "./stream.d"

export const pauseStreamNative: any =
  (data: MPauseResumeWithdrawCancel, stream: ZebecNativeStreamProps) =>
  async (dispatch: any) => {
    try {
      const response = await stream.pause(data)
      console.log(response)

      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Pause Success"
            // transactionHash: response?.data?.transactionHash
          })
        )
        // const backendData = {
        //   ...data,
        // }
        // dispatch(pauseTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
      dispatch(togglePauseModal())
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
  (data: MPauseResumeWithdrawCancel, token: ZebecNativeStreamProps) =>
  async (dispatch: any) => {
    try {
      const response = await token.pause(data)
      console.log(response)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Pause Success"
            // transactionHash: response?.data?.transactionHash
          })
        )
        // const backendData = {
        //   ...data,
        // }
        // dispatch(pauseTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
      dispatch(togglePauseModal())
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(togglePauseModal())
    }
  }
