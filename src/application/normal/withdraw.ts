/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ZebecNativeStream,
  ZebecTokenStream,
  MDepositWithdrawFromZebecVault
} from "zebec-anchor-sdk-npmtest/packages/stream"
import { toast } from "features/toasts/toastsSlice"
import { Dispatch, SetStateAction } from "react"

export const withdrawNative: any =
  (
    data: MDepositWithdrawFromZebecVault,
    stream: ZebecNativeStream,
    setLoading: Dispatch<SetStateAction<boolean>>,
    callback?: () => void
  ) =>
  async (dispatch: any) => {
    try {
      const response = await stream.withdrawSolFromZebecVault(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Withdraw Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        if (callback) callback()
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
    }
    // Loading
    setLoading(false)
  }

export const withdrawToken: any =
  (
    data: MDepositWithdrawFromZebecVault,
    token: ZebecTokenStream,
    setLoading: Dispatch<SetStateAction<boolean>>,
    callback?: () => void
  ) =>
  async (dispatch: any) => {
    try {
      const response = await token.withdrawTokenFromZebecVault(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Withdraw Success",
            transactionHash: response?.data?.transactionHash
          })
        )
        if (callback) callback()
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
    }
    // Loading
    setLoading(false)
  }
