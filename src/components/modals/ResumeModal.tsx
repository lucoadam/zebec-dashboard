import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, toggleResumeModal } from "features/modals/resumeModalSlice"
import { resumeStreamNative, resumeStreamToken } from "application/normal"
import { Button, Modal } from "components/shared"
import ZebecContext from "app/zebecContext"

const ResumeModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token } = useContext(ZebecContext)
  const { show, loading, transaction } = useAppSelector((state) => state.resume)
  const dispatch = useAppDispatch()

  const handleResumeTransaction = () => {
    dispatch(setLoading(true))
    // data
    const data = {
      sender: transaction.sender,
      receiver: transaction.receiver,
      escrow: transaction.pda
    }
    if (transaction.symbol === "SOL")
      stream && dispatch(resumeStreamNative(data, stream))
    else token && dispatch(resumeStreamToken(data, token))
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
