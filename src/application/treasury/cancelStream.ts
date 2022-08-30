import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import { ZebecTokenTreasuryProps, ZebecTreasuryProps } from "./stream"

interface CancelStreamProps {
  data: {
    safe_address: string
    receiver: string
    stream_data_account: string
    safe_data_account: string
    sender: string
    token_mint_address?: string
  }
  treasury: ZebecTreasuryProps | ZebecTokenTreasuryProps
}
export const cancelStream =
  ({ data, treasury }: CancelStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await treasury.cancel(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction cancelled successfully.",
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
