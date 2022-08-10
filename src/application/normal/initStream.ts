/* eslint-disable @typescript-eslint/no-explicit-any */
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { sendContinuousStream } from "features/stream/streamSlice"
import { toast } from "features/toasts/toastsSlice"
import { ZebecNativeStreamProps } from "./stream.d"

export const initStreamNative: any =
  (data: any, stream: ZebecNativeStreamProps) => async (dispatch: any) => {
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
          transactionHash: response?.data?.transactionHash
        }
        dispatch(sendContinuousStream(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(toggleWalletApprovalMessageModal())
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleWalletApprovalMessageModal())
    }

    return null
  }

export const initStreamToken: any =
  (data: any, token: ZebecNativeStreamProps) => async (dispatch: any) => {
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
          transactionHash: response?.data?.transactionHash
        }
        dispatch(sendContinuousStream(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(toggleWalletApprovalMessageModal())
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleWalletApprovalMessageModal())
    }

    return null
  }
