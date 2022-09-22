import { AppDispatch } from "app/store"
import { TreasuryTransactionType } from "components/treasury/treasury.d"
import { toast } from "features/toasts/toastsSlice"
import { saveTreasuryWithdrawDepositTransactions } from "features/treasuryTransactions/treasuryTransactionsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"

interface WithdrawFromDataProps {
  data: {
    sender: string
    receiver: string
    safe_address: string
    safe_data_account: string
    amount: number
    token_mint_address?: string
    transaction_account?: string
    signer?: string
  }
  callback?: (message: "success" | "error") => void
}

type WithdrawFromTreasuryProps = WithdrawFromDataProps &
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

export const withdrawFromTreasury =
  ({ data, treasury, treasuryToken, callback }: WithdrawFromTreasuryProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.transferFromSafe(data)
      } else if (treasuryToken) {
        response = await treasuryToken.transferTokenFromSafe(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message:
              response.message ??
              "Withdraw from treasury initiated and is pending for sign.",
            transactionHash: response?.data?.transactionHash
          })
        )
        //backend call
        const payloadData = {
          amount: data.amount,
          transaction_type: TreasuryTransactionType.WITHDRAW_FROM_TREASURY,
          transaction_account: response?.data?.transaction_account,
          transaction_hash: response?.data?.transactionHash
        }

        if (!data.token_mint_address) {
          const backendData = payloadData
          dispatch(saveTreasuryWithdrawDepositTransactions(backendData))
        } else {
          const backendData = {
            ...payloadData,
            token_mint_address: data.token_mint_address
          }
          dispatch(saveTreasuryWithdrawDepositTransactions(backendData))
        }
        //callback
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

//execute withdraw from treasury //sign
export const executeWithdrawFromTreasury =
  ({ data, treasury, treasuryToken, callback }: WithdrawFromTreasuryProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.execTransferFromSafe(data)
      } else if (treasuryToken) {
        response = await treasuryToken.execTransferTokenFromSafe(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message:
              response.message ??
              "Withdraw from treasury initiated and is pending for sign.",
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
