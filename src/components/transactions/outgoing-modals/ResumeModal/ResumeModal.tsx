import React, { FC } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppSelector } from "app/hooks"
import { useDispatch } from "react-redux"
import { toggleResumeLoadingModal, toggleResumeModal } from "features/transaction/resumeModal/resumeSlice"
import * as Icons from "assets/icons"

const ResumeModal: FC = ({}) => {
  const resumeModal = useAppSelector((state) => state.resume.resumeModal)
  const resumeLoadingModal =useAppSelector((state)=>state.resume.resumeLoadingModal)
  const dispatch = useDispatch()
  const id = "Resuming"
  const { t } = useTranslation("transactions")
  return (
    <Modal
      show={resumeModal}
      toggleModal={() => dispatch(toggleResumeModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold">
            {t("outgoing-actions.resume-modal-header")}
          </div>
          <div className="pt-[12px] pb-[12px]">
            <Button
              className={`w-full ${resumeLoadingModal ? "cursor-not-allowed" : ""}`}
              variant="gradient"
              endIcon={resumeLoadingModal ? <Icons.Loading /> : <></>}
              disabled={resumeLoadingModal}
              title={
                resumeLoadingModal
                  ? t("outgoing-actions.resuming")
                  : t("outgoing-actions.yes-resume")
              }
              onClick={() => {
                dispatch(toggleResumeLoadingModal(true))
                setTimeout(() => {
                  dispatch(toggleResumeModal())
                 dispatch(toggleResumeLoadingModal(false))
                }, 5000)
              }}
            />
          </div>
          <div className="">
            <Button
              className={`w-full `}
              disabled={resumeLoadingModal}
              title={t("outgoing-actions.no-resume")}
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
