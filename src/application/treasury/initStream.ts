import { AppDispatch } from "app/store"
import { sendTreasuryContinuousStream } from "features/stream/streamSlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"

interface InitStreamProps {
  data: {
    sender: string
    receiver: string
    safe_address: string
    safe_data_account: string
    start_time: number
    end_time: number
    amount: number
    token_mint_address?: string
    //----
    name: string
    transaction_type: string
    token: string
    remarks: string
    file?: string
  }
  treasury: ZebecNativeTreasury | ZebecTokenTreasury
}

export const initStreamTreasury =
  ({ data, treasury }: InitStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await treasury.init(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Stream initiated successfully.",
            transactionHash: response?.data?.transactionHash
          })
        )
        dispatch(sendTreasuryContinuousStream(data))
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
