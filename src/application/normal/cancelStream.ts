/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDispatch } from "app/store"
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
      dispatch(
        cancelTransaction({
          uuid
        })
      )
      const response = await stream.cancel(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Cancel Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          uuid,
          txn_hash: response?.data?.transactionHash
        }
        dispatch(cancelTransaction(backendData))
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
  (
    data: MPauseResumeWithdrawCancel,
    uuid: string,
    token: ZebecNativeStreamProps
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(
        cancelTransaction({
          uuid
        })
      )
      const response = await token.cancel(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Cancel Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          uuid,
          txn_hash: response?.data?.transactionHash
        }
        dispatch(cancelTransaction(backendData))
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
