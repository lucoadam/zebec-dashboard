import {
  // resumeTransaction,
  toggleResumeModal
} from "features/modals/resumeModalSlice"
import { toast } from "features/toasts/toastsSlice"
import { MPauseResumeWithdrawCancel, ZebecNativeStreamProps } from "./stream.d"

export const resumeStreamNative: any =
  (data: MPauseResumeWithdrawCancel, stream: ZebecNativeStreamProps) =>
  async (dispatch: any) => {
    try {
      const response = await stream.resume(data)
      console.log(response)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Resume Success"
            // transactionHash: response?.data?.transactionHash
          })
        )
        // const backendData = {
        //   ...data,
        // }
        // dispatch(resumeTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
      dispatch(toggleResumeModal())
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleResumeModal())
    }
  }

export const resumeStreamToken: any =
  (data: MPauseResumeWithdrawCancel, token: ZebecNativeStreamProps) =>
  async (dispatch: any) => {
    try {
      const response = await token.resume(data)
      console.log(response)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Resume Success"
            // transactionHash: response?.data?.transactionHash
          })
        )
        // const backendData = {
        //   ...data,
        // }
        // dispatch(resumeTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
      dispatch(toggleResumeModal())
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleResumeModal())
    }
  }
