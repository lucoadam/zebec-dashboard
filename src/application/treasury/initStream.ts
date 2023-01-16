import { AppDispatch } from "app/store"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { sendTreasuryContinuousStream } from "features/stream/streamSlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"

interface InitStreamDataProps {
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
    can_cancel: boolean
    can_update: boolean
  }
  callback?: (message: "success" | "error") => void
}

type InitStreamProps = InitStreamDataProps &
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

interface ExecuteInitStreamDataProps {
  data: {
    safe_data_account: string
    safe_address: string
    stream_data_account: string
    transaction_account: string
    signer: string
    receiver: string
    token_mint_address?: string
  }
  callback?: (message: "success" | "error") => void
}

type ExecuteInitStreamProps = ExecuteInitStreamDataProps &
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

export const initStreamTreasury =
  ({ data, callback, treasury, treasuryToken }: InitStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.init(data)
      } else if (treasuryToken) {
        response = await treasuryToken.init(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Stream initiated successfully.",
            transactionHash: response?.data?.transactionHash
          })
        )

        const payloadData = {
          start_time: data.start_time,
          end_time: data.end_time,
          amount: data.amount,
          receiver: data.receiver,
          name: data.name,
          remarks: data.remarks,
          pda: response?.data?.stream_data_account,
          transaction_account: response?.data?.transaction_account,
          transaction_hash: response?.data?.transactionHash,
          file: data.file,
          can_cancel: data.can_cancel
        }
        if (!data.token_mint_address) {
          const backendData = payloadData
          dispatch(sendTreasuryContinuousStream(backendData)).then(() => {
            if (callback) {
              callback("success")
            }
          })
        } else {
          const backendData = {
            ...payloadData,
            token_mint_address: data.token_mint_address
          }
          dispatch(sendTreasuryContinuousStream(backendData)).then(() => {
            if (callback) {
              callback("success")
            }
          })
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

//Execute init stream
export const executeInitStreamTreasury =
  ({ data, callback, treasury, treasuryToken }: ExecuteInitStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.execInit(data)
      } else if (treasuryToken) {
        response = await treasuryToken.execInit(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Stream initiated successfully.",
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
