/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendContinuousStream } from "features/stream/streamSlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeStream,
  ZebecTokenStream
} from "zebec-anchor-sdk-npmtest/packages/stream"

export const initStreamNative: any =
  (
    data: any,
    stream: ZebecNativeStream,
    callback?: (message: "success" | "error") => void
  ) =>
  async (dispatch: any) => {
    try {
      const response = await stream.init(data)

      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          ...data,
          pda: response?.data?.pda,
          transaction_hash: response?.data?.transactionHash
        }
        dispatch(sendContinuousStream(backendData)).then(() => {
          if (callback) {
            callback("success")
          }
        })
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        if (callback) {
          callback("error")
        }
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      if (callback) {
        callback("error")
      }
    }

    return null
  }

export const initStreamToken: any =
  (
    data: any,
    token: ZebecTokenStream,
    callback?: (message: "success" | "error") => void
  ) =>
  async (dispatch: any) => {
    try {
      const response = await token.init(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          ...data,
          pda: response?.data?.pda,
          transaction_hash: response?.data?.transactionHash
        }
        dispatch(sendContinuousStream(backendData)).then(() => {
          if (callback) {
            callback("success")
          }
        })
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        if (callback) {
          callback("error")
        }
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      if (callback) {
        callback("error")
      }
    }

    return null
  }
