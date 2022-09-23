import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, toggleCancelModal } from "features/modals/cancelModalSlice"
import { cancelStreamNative, cancelStreamToken } from "application/normal"
import { Button, Modal } from "components/shared"
import ZebecContext from "app/zebecContext"
import { useZebecWallet } from "hooks/useWallet"
import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecEthBridgeClient
} from "@zebec-io/zebec-wormhole-sdk/dist/types"
import { useSigner } from "wagmi"
import { getEVMToWormholeChain } from "constants/wormholeChains"

const CancelModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const { data: signer } = useSigner()
  const walletObject = useZebecWallet()
  const { show, loading, transaction } = useAppSelector((state) => state.cancel)

  const handleSolanaCancel = async () => {
    dispatch(setLoading(true))
    // data
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
  }

  const handleEVMCancel = async () => {
    if (!signer) return
    const messengerContract = new ZebecEthBridgeClient(
      BSC_ZEBEC_BRIDGE_ADDRESS,
      signer,
      getEVMToWormholeChain(walletObject.chainId)
    )
    console.log("transaction:", transaction)
    const tx = await messengerContract.cancelTokenStream(
      transaction.sender,
      transaction.receiver,
      transaction.token_mint_address,
      transaction.pda
    )
    console.log("tx:", tx)
  }

  const handleCancelTransaction = () => {
    if (walletObject.chainId === "solana") {
      handleSolanaCancel()
    } else {
      handleEVMCancel()
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
