import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import { createTreasury as createNewTreasury } from "features/treasury/treasurySlice"
import { ZebecNativeTreasury } from "zebec-anchor-sdk-npmtest/packages/multisig"
import EthersAdapter from "@safe-global/safe-ethers-lib"
import { useProvider, useSigner } from "wagmi"
import { ethers, Signer } from "ethers"
import {
  SafeAccountConfig,
  SafeDeploymentConfig,
  SafeFactory
} from "@safe-global/safe-core-sdk"
import { networkConfig } from "constants/networkConfig"

interface CreateSafeEvmProps {
  data: {
    name: string
    minValidator: number
    owners: string[]
  }
  signer: Signer
  callback?: () => void
  errorCallback?: (error: any) => void
}

export const createSafeEvm =
  ({ data,  signer, callback, errorCallback }: CreateSafeEvmProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const safeAccountConfig: SafeAccountConfig = {
        owners: data.owners,
        threshold: data.minValidator
      }

      const nonce = await signer?.provider?.getTransactionCount(
        signer.getAddress(),
        "latest"
      )

      const safeDeploymentConfig: SafeDeploymentConfig = {
        saltNonce: (nonce || 1).toString()
      }

      if (signer) {
        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: signer
        })
        const safe = await SafeFactory.create({ ethAdapter, contractNetworks: networkConfig })

        // Predict deployed address
        const predictedDeployAddress = await safe.predictSafeAddress({
          safeAccountConfig,
          safeDeploymentConfig
        })

        // Get Transaction Hash
        let txnHash: any
        const createSafeCallback = (txHash: string) => {
          console.log("Safe creation hash: ", txHash)
          txnHash = txHash
        }

        // Deploy Safe
        const newSafe = await safe.deploySafe({
          safeAccountConfig,
          safeDeploymentConfig,
          options: { gasLimit: "2000000" },
          callback: createSafeCallback
        })
        dispatch(
          toast.success({
            message: "Treasury created successfully",
            transactionHash: txnHash ? txnHash.toString() : ""
          })
        )

        // if (
        //   (await newSafe.getOwners()) != owners &&
        //   (await newSafe.getThreshold()) != data.minValidator
        // ) {
        //   dispatch(
        //     toast.error({
        //       message: "Owner/Threshold mismatch"
        //     })
        //   )
        // }
        callback?.()
      } else {
        dispatch(
          toast.error({
            message: "Signer not found"
          })
        )
        errorCallback?.("Signer not found")
      }
    } catch (error: any) {
      dispatch(
        toast.error({
          message: error?.message ?? "Unknown Error"
        })
      )
      errorCallback?.(error?.message ?? "Unknown Error")
    }
    return null
  }