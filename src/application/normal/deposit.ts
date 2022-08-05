import { Dispatch, SetStateAction } from "react"
import {
  ZebecNativeStreamProps,
  MDepositWithdrawFromZebecVault
} from "./stream"
import { toast } from "features/toasts/toastsSlice"

export const depositNative =
  (
    data: MDepositWithdrawFromZebecVault,
    stream: ZebecNativeStreamProps,
    setLoading: Dispatch<SetStateAction<boolean>>
  ) =>
  async (dispatch: any) => {
    try {
      const response = await stream.depositSolToZebecVault(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Deposit Success",
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

export const depositToken =
  (
    data: MDepositWithdrawFromZebecVault,
    token: ZebecNativeStreamProps,
    setLoading: Dispatch<SetStateAction<boolean>>
  ) =>
  async (dispatch: any) => {
    try {
      const response = await token.depositTokenToZebecVault(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Deposit Success",
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
