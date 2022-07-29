import { ZebecNativeStreamProps } from "./stream.d"
import { toast } from "features/toasts/toastsSlice"
import {
  // pauseTransaction,
  togglePauseModal
} from "features/modals/pauseModalSlice"

export const pauseStreamNative =
  (data: any, stream: ZebecNativeStreamProps) => async (dispatch: any) => {
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

export const pauseStreamToken =
  (data: any, token: ZebecNativeStreamProps) => async (dispatch: any) => {
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
