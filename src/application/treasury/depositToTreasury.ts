import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"

interface DepositToTreasuryProps {
  data: {
    sender: string
    safe_address: string
    amount: number
    token_mint_address?: string
  }
  treasury: ZebecNativeTreasury | ZebecTokenTreasury
  callback?: () => void
}

export const depositToTreasury =
  ({ data, treasury, callback }: DepositToTreasuryProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address) {
        response = await treasury.depositSolToSafe(data)
      } else {
        response = await treasury.depositTokenToSafe(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Deposit to treasury success.",
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
  }
