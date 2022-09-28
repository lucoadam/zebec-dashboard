import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import { updateIncomingTransactions } from "features/transactions/transactionsSlice"
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
    transaction_kind: string
    transaction_uuid: string
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
        console.log('test')
        dispatch(
          updateIncomingTransactions({
            transaction_kind: data.transaction_kind,
            transaction_uuid: data.transaction_uuid
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
