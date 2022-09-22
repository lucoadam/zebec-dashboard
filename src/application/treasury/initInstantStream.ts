import { AppDispatch } from "app/store"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"
import { sendTreasuryInstantTransfer } from "features/stream/streamSlice"

interface InitInstantStreamDataProps {
  data: {
    sender: string
    receiver: string
    safe_address: string
    safe_data_account: string
    amount: number
    token_mint_address?: string
    // ----
    name: string
    token: string
    remarks?: string
    file?: string
  }
  callback?: (message: "success" | "error") => void
}
interface ExecuteInitInstantStreamDataProps {
  data: {
    safe_address: string
    safe_data_account: string
    transaction_account: string
    receiver: string
    signer: string
    token_mint_address?: string
  }
  callback?: (message: "success" | "error") => void
}

type InitInstantStreamProps = InitInstantStreamDataProps &
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
type ExecuteInitInstantStreamProps = ExecuteInitInstantStreamDataProps &
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

export const initInstantStreamTreasury =
  ({ data, callback, treasury, treasuryToken }: InitInstantStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.instantTransfer(data)
      } else if (treasuryToken) {
        response = await treasuryToken.instanttransfer(data)
      }
      console.log(response)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Deposit to treasury success.",
            transactionHash: response?.data?.transactionHash
          })
        )

        const payloadData = {
          amount: data.amount,
          receiver: data.receiver,
          name: data.name,
          remarks: data.remarks,
          transaction_account: response?.data?.transaction_account,
          transaction_hash: response?.data?.transactionHash,
          file: data.file
        }

        if (!data.token_mint_address) {
          const backendData = payloadData
          dispatch(sendTreasuryInstantTransfer(backendData)).then(() => {
            if (callback) {
              callback("success")
            }
          })
        } else {
          const backendData = {
            ...payloadData,
            token_mint_address: data.token_mint_address
          }
          dispatch(sendTreasuryInstantTransfer(backendData)).then(() => {
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

//Execute instant stream to treasury //sign
export const executeInitInstantStreamTreasury =
  ({
    data,
    callback,
    treasury,
    treasuryToken
  }: ExecuteInitInstantStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.execInstantTransfer(data)
      } else if (treasuryToken) {
        response = await treasuryToken.execInstanttransfer(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message:
              response.message ??
              "Withdraw from treasury executed successfully.",
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
