import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import { ZebecTokenTreasuryProps, ZebecTreasuryProps } from "./stream"

interface InitInstantStreamProps {
  data: {
    sender: string
    receiver: string
    safe_address: string
    safe_data_account: string
    amount: number
    token_mint_address?: string
  }
  treasury: ZebecTreasuryProps | ZebecTokenTreasuryProps
}

export const initInstantStream =
  ({ data, treasury }: InitInstantStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      // const response = await treasury.instanttransfer(data)
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
    }
  }
