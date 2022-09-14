import { AppDispatch } from "app/store"
import { TreasuryTransactionType } from "components/treasury/treasury.d"
import { transferToVault } from "features/modals/transferToVaultModalSlice"
import { setLoading } from "features/modals/transferToTreasuryModalSlice"
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

        const payloadData = {
          amount: data.amount,
          transaction_type:
            TreasuryTransactionType.WITHDRAW_FROM_TREASURY_VAULT,
          transaction_account: response?.data?.transaction_account,
          transaction_hash: response?.data?.transactionHash
        }

        if (!data.token_mint_address) {
          const backendData = payloadData
          dispatch(transferToVault(backendData))
        } else {
          const backendData = {
            ...payloadData,
            token_mint_address: data.token_mint_address
          }
          dispatch(transferToVault(backendData))
        }
        if (callback) {
          callback("success")
        }
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(setLoading(false))
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
      dispatch(setLoading(false))
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
