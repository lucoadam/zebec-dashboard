import {
  ZebecNativeStreamProps,
  MDepositWithdrawFromZebecVault
} from "./stream"
import { toast } from "features/toasts/toastsSlice"
import { Dispatch, SetStateAction } from "react"

export const withdrawNative =
  (
    data: MDepositWithdrawFromZebecVault,
    stream: ZebecNativeStreamProps,
    setLoading: Dispatch<SetStateAction<boolean>>
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

export const withdrawToken =
  (
    data: MDepositWithdrawFromZebecVault,
    token: ZebecNativeStreamProps,
    setLoading: Dispatch<SetStateAction<boolean>>
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
