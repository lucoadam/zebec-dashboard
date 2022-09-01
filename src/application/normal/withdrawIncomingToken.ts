import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeStream,
  ZebecTokenStream
} from "zebec-anchor-sdk-npmtest/packages/stream"

interface WithdrawIncomingTokenProps {
  data: {
    sender: string
    receiver: string
    escrow: string
    token_mint_address?: string
  }
  stream: ZebecNativeStream | ZebecTokenStream
}

export const withdrawIncomingToken =
  ({ data, stream }: WithdrawIncomingTokenProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await stream.withdraw(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Token withdrawn successfully.",
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
  }
