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
  getBridgeAddressForChain,
  WORMHOLE_RPC_HOSTS,
  ZebecEthBridgeClient
} from "zebec-wormhole-sdk-test"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { toast } from "features/toasts/toastsSlice"
import { resumeStreamTreasury } from "application"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  getEmitterAddressEth,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth
} from "@certusone/wormhole-sdk"
import { listenWormholeTransactionStatus } from "api/services/fetchEVMTransactionStatus"
import { checkRelayerStatus } from "api/services/pingRelayer"

const ResumeModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token, treasury, treasuryToken } = useContext(ZebecContext)
  const { show, loading, transaction } = useAppSelector((state) => state.resume)
  const dispatch = useAppDispatch()
  const walletObject = useZebecWallet()
  const { data: signer } = useSigner()
  const { publicKey } = useWallet()
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const handleSolanaResume = async () => {
    dispatch(setLoading(true))
    // data
    if (!transaction.approval_status) {
      const data = {
        sender: transaction.sender,
        receiver: transaction.receiver,
        escrow: transaction.pda,
        token_mint_address: transaction.token_mint_address
      }
      const transaction_uuid = transaction.uuid
      if (transaction.token === "SOL")
        stream && dispatch(resumeStreamNative(data, transaction_uuid, stream))
      else token && dispatch(resumeStreamToken(data, transaction_uuid, token))
    } else if (activeTreasury) {
      const data = {
        safe_address: activeTreasury.treasury_address,
        safe_data_account: activeTreasury.treasury_escrow,
        sender: publicKey?.toString() || "",
        receiver: transaction.receiver,
        stream_data_account: transaction.pda,
        token_mint_address: transaction.token_mint_address,
        uuid: transaction.uuid
      }
      if (!transaction.token_mint_address && treasury) {
        dispatch(
          resumeStreamTreasury({
            data: data,
            treasury: treasury
          })
        )
      } else if (treasuryToken) {
        dispatch(
          resumeStreamTreasury({
            data: data,
            treasuryToken: treasuryToken
          })
        )
      }
    }
  }

  const handleEVMResume = async () => {
    try {
      if (!signer) return
      dispatch(setLoading(true))
      const isRelayerActive = await checkRelayerStatus()
      if (!isRelayerActive) {
        dispatch(
          toast.error({
            message:
              "Backend Service is currently down. Please try again later."
          })
        )
        dispatch(setLoading(false))
        return
      }
      const sourceChain = getEVMToWormholeChain(walletObject.chainId)
      const messengerContract = new ZebecEthBridgeClient(
        BSC_ZEBEC_BRIDGE_ADDRESS,
        signer,
        sourceChain
      )
      // commented console.log("pda-data:", transaction)
      const receipt = await messengerContract.pauseResumeStream(
        transaction.senderEvm,
        transaction.receiverEvm,
        transaction.token_mint_address,
        transaction.pda
      )
      const msgSequence = parseSequenceFromLogEth(
        receipt,
        getBridgeAddressForChain(sourceChain)
      )
      const messageEmitterAddress = getEmitterAddressEth(
        BSC_ZEBEC_BRIDGE_ADDRESS
      )
      const { vaaBytes: signedVaa } = await getSignedVAAWithRetry(
        WORMHOLE_RPC_HOSTS,
        sourceChain,
        messageEmitterAddress,
        msgSequence
      )

      // check if message is relayed
      const response = await listenWormholeTransactionStatus(
        signedVaa,
        walletObject.originalAddress?.toString() as string,
        sourceChain
      )
      if (response === "success") {
        dispatch(toast.success({ message: "Stream resumed" }))
      } else if (response === "timeout") {
        dispatch(toast.error({ message: "Stream resume timeout" }))
      } else {
        dispatch(toast.error({ message: "Stream resume failed" }))
      }
      dispatch(setLoading(false))
      dispatch(toggleResumeModal())
    } catch (e) {
      // commented console.log("error:", e)
      setLoading(false)
      dispatch(toggleResumeModal())
      dispatch(toast.error({ message: "Stream resume failed" }))
    }
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
