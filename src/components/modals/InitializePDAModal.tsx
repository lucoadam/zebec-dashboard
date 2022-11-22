import React, { FC, useState } from "react"
import { Button, Modal } from "components/shared"
import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecEthBridgeClient
} from "@zebec-protocol/wormhole-bridge"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { useSigner } from "wagmi"
import { useZebecWallet } from "hooks/useWallet"
import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  setPdaBalance,
  setShowPdaInitialize
} from "features/modals/pdaInitializeModalSlice"
import { toast } from "features/toasts/toastsSlice"
import { checkPDAinitialized } from "utils/checkPDAinitialized"

export const InitializePDAModal: FC = () => {
  const { showPdaInitialize, balance } = useAppSelector(
    (state) => state.pdaInitialize
  )
  const dispatch = useAppDispatch()
  const { data: signer } = useSigner()
  const walletObject = useZebecWallet()
  const [loading, setLoading] = useState(false)

  const check = async () => {
    try {
      if (signer) {
        setLoading(true)
        const sourceChain = getEVMToWormholeChain(walletObject.chainId)
        const messengerContract = new ZebecEthBridgeClient(
          BSC_ZEBEC_BRIDGE_ADDRESS,
          signer,
          sourceChain
        )
        await messengerContract.registerUser(
          walletObject.originalAddress?.toString() || ""
        )
        let retry = 0
        let checkPda
        while (true) {
          checkPda = await checkPDAinitialized(
            walletObject.publicKey?.toString() || ""
          )
          if (!checkPda.isBalanceRequired) {
            break
          }
          if (retry > 60) {
            throw new Error("PDA not initialized")
          }
          await new Promise((resolve) => setTimeout(resolve, 4000))
          retry += 1
        }
        dispatch(
          toast.success({
            message:
              balance === 0
                ? "PDA initialized successfully"
                : "PDA fee loaded successfully"
          })
        )
        dispatch(setPdaBalance(checkPda.balance))
        setLoading(false)
        dispatch(setShowPdaInitialize(false))
      }
    } catch (e) {
      setLoading(false)
      dispatch(
        toast.error({
          message:
            balance === 0
              ? "Failed to initialize PDA"
              : "Failed to load PDA fee"
        })
      )
      dispatch(setShowPdaInitialize(false))
    }
  }
  return (
    <Modal
      show={showPdaInitialize}
      toggleModal={() => dispatch(setShowPdaInitialize(!showPdaInitialize))}
      size="medium"
      className="modal-gradient-border p-0"
      hasCloseIcon
    >
      <div className="flex-none px-6 py-[50px]">
        <div className="flex items-center gap-x-[6px] justify-center text-content-primary">
          <p className="text-body">
            {balance === 0
              ? "Your Solana account is not initialized. Please initialize it."
              : "Your Solana account has insufficient fee. Please load it."}
          </p>
        </div>
        <Button
          className="w-full mt-8"
          title={
            balance === 0 ? "Initialize Solana account" : "Load account fee"
          }
          variant="gradient"
          onClick={check}
          loading={loading}
        />
      </div>
    </Modal>
  )
}
