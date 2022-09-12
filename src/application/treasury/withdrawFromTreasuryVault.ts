import { AppDispatch } from "app/store"
import { withdrawFromTreasuryToWallet } from "features/modals/withdrawFromTreasurySlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"

interface WithdrawFromTreasuryVaultDataProps {
  data: {
    sender: string
    safe_address: string
    safe_data_account: string
    receiver: string
    amount: number
    token_mint_address?: string
    transaction_account?: string
    signer?: string
  }
  callback?: (message: "success" | "error") => void
}

type WithdrawFromTreasuryVaultProps = WithdrawFromTreasuryVaultDataProps &
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

export const withdrawFromTreasuryVault =
  ({
    data,
    callback,
    treasury,
    treasuryToken
  }: WithdrawFromTreasuryVaultProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.instantTransfer(data)
      } else if (treasuryToken) {
        response = await treasuryToken.instanttransfer(data)
      }

      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Deposit to treasury success.",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          ...data,
          transaction_account: response.data.transaction_account
        }
        dispatch(withdrawFromTreasuryToWallet(backendData))
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

//Execute deposit to treasury //sign
export const executeWithdrawFromTreasuryVault =
  ({
    data,
    callback,
    treasury,
    treasuryToken
  }: WithdrawFromTreasuryVaultProps) =>
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
