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
} from "@jettxcypher/zebec-wormhole-sdk"
import { useSigner } from "wagmi"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { cancelStreamTreasury } from "application"
import { useWallet } from "@solana/wallet-adapter-react"

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
    if (!signer) return
    dispatch(setLoading(true))
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
    dispatch(setLoading(false))
    dispatch(toggleCancelModal())
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
