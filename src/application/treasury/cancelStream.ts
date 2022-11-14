import { AppDispatch } from "app/store"
import { CallbackMessageType } from "components/treasury/treasury.d"
import {
  cancelTreasuryTransaction,
  toggleCancelModal
} from "features/modals/cancelModalSlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"

interface CancelStreamDataProps {
  data: {
    safe_address: string
    receiver: string
    stream_data_account: string
    safe_data_account: string
    sender: string
    token_mint_address?: string
    uuid: string
  }
}

type CancelStreamProps = CancelStreamDataProps &
  (
    | {
        treasury: ZebecNativeTreasury
        treasuryToken?: never
      }
    | {
        treasury?: never
        treasuryToken: ZebecTokenTreasury
      }
  )

interface ExecuteCancelStreamDataProps {
  data: {
    safe_address: string
    transaction_account: string
    receiver: string
    stream_data_account: string
    safe_data_account: string
    token_mint_address?: string
    signer: string
  }
  callback?: (message: CallbackMessageType, transaction_hash?: string) => void
}
type ExecuteCancelStreamProps = ExecuteCancelStreamDataProps &
  (
    | {
        treasury: ZebecNativeTreasury
        treasuryToken?: never
      }
    | {
        treasury?: never
        treasuryToken: ZebecTokenTreasury
      }
  )

export const cancelStreamTreasury =
  ({ data, treasury, treasuryToken }: CancelStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.cancel(data)
      } else if (treasuryToken) {
        response = await treasuryToken.cancel(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction cancelled successfully.",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          uuid: data.uuid,
          transaction_account: response?.data?.transaction_account
        }
        dispatch(cancelTreasuryTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(toggleCancelModal())
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleCancelModal())
    }
  }

export const executeCancelStreamTreasury =
  ({ data, callback, treasury, treasuryToken }: ExecuteCancelStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.execCancel(data)
      } else if (treasuryToken) {
        response = await treasuryToken.execCancel(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction cancelled successfully.",
            transactionHash: response?.data?.transactionHash
          })
        )
        if (callback) {
          callback("success", response?.data?.transactionHash)
        }
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        if (callback) {
          callback("error")
        }
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      if (callback) {
        callback("error")
      }
    }
  }
