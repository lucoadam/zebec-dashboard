import React, { FC, useState } from "react"
import { Button, Modal } from "components/shared"
import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecEthBridgeClient
} from "zebec-wormhole-sdk-test"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { useSigner } from "wagmi"
import { useZebecWallet } from "hooks/useWallet"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setShowPdaInitialize } from "features/modals/pdaInitializeModalSlice"
import { toast } from "features/toasts/toastsSlice"
import { checkPDAinitialized } from "utils/checkPDAinitialized"

export const InitializePDAModal: FC = () => {
  const { showPdaInitialize } = useAppSelector((state) => state.pdaInitialize)
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
        while (true) {
          const isRegistered = await checkPDAinitialized(
            walletObject.publicKey?.toString() || ""
          )
          if (isRegistered) {
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
            message: "PDA initialized successfully"
          })
        )
        setLoading(false)
        dispatch(setShowPdaInitialize(false))
      }
    } catch (e) {
      setLoading(false)
      dispatch(
        toast.error({
          message: "Failed to initialize PDA"
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
            Your PDA is not initialized. Please initialize it.
          </p>
        </div>
        <Button
          className="w-full mt-8"
          title="Initialize PDA"
          variant="gradient"
          onClick={check}
          loading={loading}
        />
      </div>
    </Modal>
  )
}
