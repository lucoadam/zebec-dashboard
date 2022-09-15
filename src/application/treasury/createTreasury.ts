import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import { createTreasury as createNewTreasury } from "features/treasury/treasurySlice"
import { ZebecNativeTreasury } from "zebec-anchor-sdk-npmtest/packages/multisig"

interface CreateTreasuryProps {
  data: {
    name: string
    minValidator: number
    owners: { name: string; wallet: string }[]
  }
  treasury: ZebecNativeTreasury
  callback: () => void
  errorCallback: () => void
}

export const createTreasury =
  ({ data, treasury, callback, errorCallback }: CreateTreasuryProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const sdkData = {
        owners: data.owners.map((owner) => owner.wallet),
        min_confirmation_required: data.minValidator
      }
      const response = await treasury.createSafe(sdkData)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Treasury created successfully",
            transactionHash: response?.data?.transactionHash
          })
        )
        const backendData = {
          owners: data.owners.map((owner) => {
            return {
              ...owner,
              wallet_address: owner.wallet
            }
          }),
          name: data.name,
          min_confirmations: data.minValidator,
          treasury_address: response?.data?.safe_address,
          treasury_escrow: response?.data?.safe_data_account,
          treasury_vault_address: response?.data?.safe_vault_address,
          transaction_hash: response?.data?.transactionHash
        }
        dispatch(createNewTreasury({ data: backendData, callback: callback }))
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        //Error callBack
        errorCallback()
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      //Error callBack
      errorCallback()
    }
    return null
  }
