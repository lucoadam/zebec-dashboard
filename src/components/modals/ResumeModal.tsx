import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, toggleResumeModal } from "features/modals/resumeModalSlice"
import { resumeStreamNative, resumeStreamToken } from "application/normal"
import { Button, Modal } from "components/shared"
import ZebecContext from "app/zebecContext"
import { useZebecWallet } from "hooks/useWallet"
import { useSigner } from "wagmi"
import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecEthBridgeClient
} from "@jettxcypher/zebec-wormhole-sdk"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { toast } from "features/toasts/toastsSlice"

const ResumeModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token } = useContext(ZebecContext)
  const { show, loading, transaction } = useAppSelector((state) => state.resume)
  const dispatch = useAppDispatch()
  const walletObject = useZebecWallet()
  const { data: signer } = useSigner()

  const handleSolanaResume = async () => {
    dispatch(setLoading(true))
    // data
    const data = {
      sender: transaction.sender,
      receiver: transaction.receiver,
      escrow: transaction.pda
    }
    const transaction_uuid = transaction.uuid
    if (transaction.token === "SOL")
      stream && dispatch(resumeStreamNative(data, transaction_uuid, stream))
    else token && dispatch(resumeStreamToken(data, transaction_uuid, token))
  }

  const handleEVMResume = async () => {
    if (!signer) return
    dispatch(setLoading(true))
    const messengerContract = new ZebecEthBridgeClient(
      BSC_ZEBEC_BRIDGE_ADDRESS,
      signer,
      getEVMToWormholeChain(walletObject.chainId)
    )
    console.log("pda-data:", transaction)
    const tx = await messengerContract.pauseTokenStream(
      transaction.sender,
      transaction.receiver,
      transaction.token_mint_address,
      transaction.pda
    )
    dispatch(setLoading(false))
    dispatch(toggleResumeModal())
    dispatch(
      toast.success({
        message: "Stream resume initiated"
      })
    )
    console.log("tx:", tx)
  }

  const handleResumeTransaction = () => {
    if (walletObject.chainId === "solana") {
      handleSolanaResume()
    } else {
      handleEVMResume()
    }
  }

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleResumeModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold">
            {t("modal-actions.resume-modal-header")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              className={`w-full`}
              loading={loading}
              variant="gradient"
              disabled={loading}
              title={
                loading
                  ? `${t("modal-actions.resuming")}`
                  : `${t("modal-actions.yes-resume")}`
              }
              onClick={handleResumeTransaction}
            />
          </div>
          <div className="">
            <Button
              className={`w-full`}
              disabled={loading}
              title={`${t("modal-actions.no-resume")}`}
              onClick={() => {
                dispatch(toggleResumeModal())
              }}
            />
          </div>
        </>
      }
    </Modal>
  )
}
export default ResumeModal
