import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, toggleCancelModal } from "features/modals/cancelModalSlice"
import { cancelStreamNative, cancelStreamToken } from "application/normal"
import { Button, Modal } from "components/shared"
import ZebecContext from "app/zebecContext"
import { useZebecWallet } from "hooks/useWallet"
import {
  BSC_BRIDGE_ADDRESS,
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecEthBridgeClient
} from "@lucoadam/zebec-wormhole-sdk"
import { useSigner } from "wagmi"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { cancelStreamTreasury } from "application"
import { useWallet } from "@solana/wallet-adapter-react"
import { toast } from "features/toasts/toastsSlice"
import { parseSequenceFromLogEth } from "@certusone/wormhole-sdk"
import { listenWormholeTransactionStatus } from "api/services/fetchEVMTransactionStatus"
import { checkRelayerStatus } from "api/services/pingRelayer"

const CancelModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token, treasury, treasuryToken } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const { data: signer } = useSigner()
  const walletObject = useZebecWallet()
  const { publicKey } = useWallet()
  const { show, loading, transaction } = useAppSelector((state) => state.cancel)
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const handleSolanaCancel = async () => {
    dispatch(setLoading(true))
    if (!transaction.approval_status) {
      const data = {
        sender: transaction.sender,
        receiver: transaction.receiver,
        escrow: transaction.pda,
        token_mint_address:
          transaction.token === "SOL" ? "" : transaction.token_mint_address
      }
      const transaction_uuid = transaction.uuid
      if (transaction.token === "SOL")
        stream && dispatch(cancelStreamNative(data, transaction_uuid, stream))
      else token && dispatch(cancelStreamToken(data, transaction_uuid, token))
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
          cancelStreamTreasury({
            data: data,
            treasury: treasury
          })
        )
      } else if (treasuryToken) {
        dispatch(
          cancelStreamTreasury({
            data: data,
            treasuryToken: treasuryToken
          })
        )
      }
    }
  }

  const handleEVMCancel = async () => {
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
      console.log("transaction:", transaction)
      const tx = await messengerContract.cancelTokenStream(
        transaction.sender,
        transaction.receiver,
        transaction.token_mint_address,
        transaction.pda
      )
      console.log("tx:", tx)
      const sequence = parseSequenceFromLogEth(tx, BSC_BRIDGE_ADDRESS)
      console.log("sequence:", sequence)
      const response = await listenWormholeTransactionStatus(
        sequence,
        BSC_ZEBEC_BRIDGE_ADDRESS,
        sourceChain
      )
      console.log("response", response)
      if (response === "success") {
        dispatch(toast.success({ message: "Stream cancelled" }))
      } else if (response === "timeout") {
        dispatch(toast.error({ message: "Stream cancel timeout" }))
      } else {
        dispatch(toast.error({ message: "Stream cancel failed" }))
      }
      dispatch(setLoading(false))
      dispatch(toggleCancelModal())
    } catch (e) {
      console.log("error:", e)
      setLoading(false)
      dispatch(toggleCancelModal())
      dispatch(toast.error({ message: "Stream cancel failed" }))
    }
  }

  const handleCancelTransaction = () => {
    try {
      if (walletObject.chainId === "solana") {
        handleSolanaCancel()
      } else {
        handleEVMCancel()
      }
    } catch (e) {
      setLoading(false)
      dispatch(
        toast.error({
          message: "Stream withdrawal failed"
        })
      )
    }
  }

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleCancelModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold">
            {t("modal-actions.cancel-modal-header")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              className={`w-full`}
              variant="gradient"
              disabled={loading}
              loading={loading}
              title={
                loading
                  ? `${t("modal-actions.cancelling")}`
                  : `${t("modal-actions.yes-cancel")}`
              }
              onClick={handleCancelTransaction}
            />
          </div>
          <div className="">
            <Button
              className={`w-full`}
              disabled={loading}
              title={`${t("modal-actions.no-cancel")}`}
              onClick={() => {
                dispatch(toggleCancelModal())
              }}
            />
          </div>
        </>
      }
    </Modal>
  )
}
export default CancelModal
