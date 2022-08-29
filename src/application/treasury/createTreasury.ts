import { AppDispatch } from "app/store"
import { ZebecTreasuryProps } from "application/normal/stream.d"
import { toast } from "features/toasts/toastsSlice"
import { createTreasury as createNewTreasury } from "features/treasury/treasurySlice"

interface CreateTreasuryProps {
  data: {
    name: string
    minValidator: number
    owners: { name: string; wallet: string }[]
  }
  treasury: ZebecTreasuryProps
  callback: () => void
}

export const createTreasury =
  ({ data, treasury, callback }: CreateTreasuryProps) =>
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
          transaction_hash: response?.data?.transactionHash
        }
        dispatch(createNewTreasury({ data: backendData, callback: callback }))
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
    return null
  }
