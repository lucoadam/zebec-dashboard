import { AppDispatch } from "app/store"
import {
  resumeTreasuryTransaction,
  toggleResumeModal
} from "features/modals/resumeModalSlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"

interface ResumeStreamDataProps {
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
interface ExecuteResumeStreamDataProps {
  data: {
    safe_address: string
    transaction_account: string
    receiver: string
    stream_data_account: string
    safe_data_account: string
    token_mint_address?: string
  }
}

type ResumeStreamProps = ResumeStreamDataProps &
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

type ExecuteResumeStreamProps = ExecuteResumeStreamDataProps &
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

export const resumeStreamTreasury =
  ({ data, treasury, treasuryToken }: ResumeStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.resume(data)
      } else if (treasuryToken) {
        response = await treasuryToken.resume(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction resumed successfully.",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          uuid: data.uuid,
          transaction_account: response?.data?.transaction_account
        }
        dispatch(resumeTreasuryTransaction(backendData))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(toggleResumeModal())
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleResumeModal())
    }
  }

export const executeResumeStreamTreasury =
  ({ data, treasury, treasuryToken }: ExecuteResumeStreamProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.execResume(data)
      } else if (treasuryToken) {
        response = await treasuryToken.execResume(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Transaction resumed successfully.",
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
