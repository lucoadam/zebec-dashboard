import { AppDispatch } from "app/store"
import { ZebecTokenStream } from "zebec-anchor-sdk-npmtest/packages/stream"
import { toast } from "features/toasts/toastsSlice"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { ZebecTokenTreasury } from "zebec-anchor-sdk-npmtest/packages/multisig"
import { sendNftTransfer } from "features/stream/streamSlice"

interface ExecuteDepositNftDataProps {
  data: {
    sender: string
    receiver: string
    token_mint_address: string
    amount: number
  }
  token: ZebecTokenStream
  callback?: (message: "success" | "error") => void
}

interface TransferNFTFromSafeProps {
  data: {
    sender: string
    receiver: string
    safe_address: string
    safe_data_account: string
    amount: number
    token_mint_address: string
    nft_name?: string
    nft_img_url?: string
    transaction_name?: string
    transaction_account?: string
    signer?: string
  }
  treasuryToken: ZebecTokenTreasury
  callback?: (message: "success" | "error") => void
}

export const initDepositNft =
  ({ data, token, callback }: ExecuteDepositNftDataProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      response = await token.directTransfer(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "NFT Deposit to treasury success.",
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
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
    } finally {
      dispatch(toggleWalletApprovalMessageModal())
    }
  }

export const initTransferNftFromTreasury =
  ({ data, treasuryToken, callback }: TransferNFTFromSafeProps) =>
  async (dispatch: AppDispatch) => {
    dispatch(toggleWalletApprovalMessageModal())
    try {
      let response
      response = await treasuryToken.transferTokenFromSafe(data)
      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message:
              response.message ??
              "Transfer NFT from treasury initiated and is pending for sign.",
            transactionHash: response?.data?.transactionHash
          })
        )
        const payloadData = {
          receiver: data.receiver,
          name: data.transaction_name,
          transaction_hash: response?.data?.transactionHash,
          transaction_account: response?.data?.transaction_account,
          approval_status_fn: "PENDING",
          nft_address: data.token_mint_address,
          nft_name: data.nft_name,
          nft_image_url: data.nft_img_url
        }
        dispatch(sendNftTransfer(payloadData)).then(() => {
          if (callback) {
            callback("success")
            dispatch(toggleWalletApprovalMessageModal())
          }
        })
      } else {
        dispatch(
          toast.error({
            message: response.message ?? "Unknown Error"
          })
        )
        dispatch(toggleWalletApprovalMessageModal())
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      dispatch(toggleWalletApprovalMessageModal())
    }
  }

//execute withdraw from treasury //sign
export const executeTransferNftFromTreasury =
  ({ data, treasuryToken, callback }: TransferNFTFromSafeProps) =>
  async (dispatch: AppDispatch) => {
    try {
      let response
      response = await treasuryToken.execTransferTokenFromSafe(data)

      if (response.status.toLocaleLowerCase() === "success") {
        dispatch(
          toast.success({
            message: response.message ?? "Sign for NFT transfer is executed.",
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
