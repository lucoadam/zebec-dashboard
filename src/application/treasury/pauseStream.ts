import { AppDispatch } from "app/store"
import { CallbackMessageType } from "components/treasury/treasury.d"
import {
  pauseTreasuryTransaction,
  togglePauseModal
} from "features/modals/pauseModalSlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"

interface PauseStreamDataProps {
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
interface ExecutePauseStreamDataProps {
  data: {
    safe_address: string
    transaction_account: string
    receiver: string
    stream_data_account: string
    safe_data_account: string
    token_mint_address?: string
    signer: string
  }
  callback?: (message: CallbackMessageType) => void
}

type PauseStreamProps = PauseStreamDataProps &
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
type ExecutePauseStreamProps = ExecutePauseStreamDataProps &
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

export const pauseStreamTreasury =
  ({ data, treasury, treasuryToken }: PauseStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        console.log(data)
        response = await treasury.pause(data)
      } else if (treasuryToken) {
        response = await treasuryToken.pause(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction paused successfully.",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          uuid: data.uuid,
          transaction_account: response?.data?.transaction_account
        }
        dispatch(pauseTreasuryTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
      }
      dispatch(togglePauseModal())
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(togglePauseModal())
    }
  }

export const executePauseStreamTreasury =
  ({ data, callback, treasury, treasuryToken }: ExecutePauseStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.execPause(data)
      } else if (treasuryToken) {
        response = await treasuryToken.execPause(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction paused successfully.",
            transactionHash: response?.data?.transactionHash
          })
        )
        if (callback) {
          callback("success")
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
