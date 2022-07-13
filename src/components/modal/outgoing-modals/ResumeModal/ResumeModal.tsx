import React, { FC } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"

import * as Icons from "assets/icons"
import { setLoading, toggleResumeModal } from "features/modals/resumeModal/resumeModalSlice"

const ResumeModal: FC = ({}) => {
  const show = useAppSelector((state) => state.resume.show)
  const loading = useAppSelector(
    (state) => state.resume.loading
  )
  const dispatch = useAppDispatch()
  const id = "Resuming"
  const { t } = useTranslation("transactions")
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
            {t("outgoing-actions.resume-modal-header")}
          </div>
          <div className="pt-[12px] pb-[12px]">
            <Button
              className={`w-full `}
              variant="gradient"
              endIcon={loading ? <Icons.Loading /> : <></>}
              disabled={loading}
              title={
                loading
                  ? t("outgoing-actions.resuming")
                  : t("outgoing-actions.yes-resume")
              }
              onClick={() => {
                dispatch(setLoading(true))
                setTimeout(() => {
                  dispatch(toggleResumeModal())
                  dispatch(setLoading(false))
                }, 5000)
              }}
            />
          </div>
          <div className="">
            <Button
              className={`w-full ${
                loading ? "cursor-not-allowed" : ""
              } `}
              disabled={loading}
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
