import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, toggleResumeModal } from "features/modals/resumeModalSlice"
import { resumeStreamNative, resumeStreamToken } from "application/normal"
import { Button, Modal } from "components/shared"
import ZebecContext from "app/zebecContext"
import { resumeStreamTreasury } from "application"
import { useWallet } from "@solana/wallet-adapter-react"

const ResumeModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token, treasury, treasuryToken } = useContext(ZebecContext)
  const { show, loading, transaction } = useAppSelector((state) => state.resume)
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const handleResumeTransaction = () => {
    dispatch(setLoading(true))
    // data
    if (!transaction.approval_status) {
      const data = {
        sender: transaction.sender,
        receiver: transaction.receiver,
        escrow: transaction.pda
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
