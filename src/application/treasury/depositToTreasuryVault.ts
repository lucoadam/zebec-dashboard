import { AppDispatch } from "app/store"
import { setLoading } from "features/modals/transferToVaultModalSlice"
import { toast } from "features/toasts/toastsSlice"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"
import {
  TreasuryTransactionType,
  CallbackMessageType
} from "components/treasury/treasury.d"
import { saveTreasuryWithdrawDepositTransactions } from "features/treasuryTransactions/treasuryTransactionsSlice"

interface DepositToTreasuryVaultDataProps {
  data: {
    sender: string
    safe_address: string
    safe_data_account: string
    amount: number
    token_mint_address?: string
    transaction_account?: string
    signer?: string
  }
  callback?: (message: CallbackMessageType) => void
}

type DepositToTreasuryVaultProps = DepositToTreasuryVaultDataProps &
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

export const depositToTreasuryVault =
  ({ data, callback, treasury, treasuryToken }: DepositToTreasuryVaultProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.deposit(data)
      } else if (treasuryToken) {
        response = await treasuryToken.deposit(data)
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
          transaction_type: TreasuryTransactionType.DEPOSIT_TO_TREASURY_VAULT,
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
export const executeDepositToTreasuryVault =
  ({ data, callback, treasury, treasuryToken }: DepositToTreasuryVaultProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      if (!data.token_mint_address && treasury) {
        response = await treasury.execDespoit(data)
      } else if (treasuryToken) {
        response = await treasuryToken.execDespoit(data)
      }
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message:
              response.message ?? "Deposit to treasury executed successfully.",
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
