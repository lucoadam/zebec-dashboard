import {
  ZebecNativeStream,
  ZebecTokenStream,
  MPauseResumeWithdrawCancel
} from "zebec-anchor-sdk-npmtest/packages/stream"
import {
  resumeTransaction,
  toggleResumeModal
} from "features/modals/resumeModalSlice"
import { toast } from "features/toasts/toastsSlice"

export const resumeStreamNative: any =
  (data: MPauseResumeWithdrawCancel, uuid: string, stream: ZebecNativeStream) =>
  async (dispatch: any) => {
    try {
      const response = await stream.resume(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Resume Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        dispatch(resumeTransaction(uuid))
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
  (data: MPauseResumeWithdrawCancel, uuid: string, token: ZebecTokenStream) =>
  async (dispatch: any) => {
    try {
      const response = await token.resume(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Resume Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        dispatch(resumeTransaction(uuid))
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
