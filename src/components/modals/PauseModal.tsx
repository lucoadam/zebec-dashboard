import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, togglePauseModal } from "features/modals/pauseModalSlice"
import { pauseStreamNative, pauseStreamToken } from "application/normal"
import { Modal, Button } from "components/shared"
import ZebecContext from "app/zebecContext"
import { pauseStreamTreasury } from "application"
import { useWallet } from "@solana/wallet-adapter-react"

const PauseModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token, treasury, treasuryToken } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const { show, loading, transaction } = useAppSelector((state) => state.pause)
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const handlePauseTransaction = () => {
    dispatch(setLoading(true))

    if (!transaction.approval_status) {
      // data
      const data = {
        sender: transaction.sender,
        receiver: transaction.receiver,
        escrow: transaction.pda,
        token_mint_address: transaction.token_mint_address
      }
      const transaction_uuid = transaction.uuid
      if (transaction.token === "SOL")
        stream && dispatch(pauseStreamNative(data, transaction_uuid, stream))
      else token && dispatch(pauseStreamToken(data, transaction_uuid, token))
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
          pauseStreamTreasury({
            data: data,
            treasury: treasury
          })
        )
      } else if (treasuryToken) {
        dispatch(
          pauseStreamTreasury({
            data: data,
            treasuryToken: treasuryToken
          })
        )
      }
    }
  }

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(togglePauseModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold ">
            {t("modal-actions.pause-modal-header")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              disabled={loading}
              loading={loading}
              className={`w-full`}
              variant="gradient"
              title={
                loading
                  ? `${t("modal-actions.pausing")}`
                  : `${t("modal-actions.yes-pause")}`
              }
              onClick={handlePauseTransaction}
            />
          </div>
          <div className="">
            <Button
              className={`w-full`}
              disabled={loading}
              title={`${t("modal-actions.no-pause")}`}
              onClick={() => {
                dispatch(togglePauseModal())
              }}
            />
          </div>
        </>
      }
    </Modal>
  )
}
export default PauseModal
