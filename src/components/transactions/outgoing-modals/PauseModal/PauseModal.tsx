import React, { FC, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button } from "components/shared"
import { Modal } from "components/shared"
import { useAppSelector } from "app/hooks"
import { useDispatch } from "react-redux"
import { togglePauseLoadingModal, togglePauseModal } from "features/transaction/pauseModal/pauseSlice"
import * as Icons from "assets/icons"

const PauseModal: FC = ({}) => {
  const pauseModal = useAppSelector((state) => state.pause.pauseModal)
  const pauseLoadingModal = useAppSelector((state)=>state.pause.pauseLoading)
  const dispatch = useDispatch()
  const [onClick, setOnClick] = useState(false)
  const { t } = useTranslation("transactions")
  return (
    <Modal
      show={pauseModal}
      toggleModal={() => dispatch(togglePauseModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold ">
            {t("outgoing-actions.pause-modal-header")}
          </div>
          <div className="pt-[12px] pb-[12px]">
            <Button
              disabled={pauseLoadingModal}
              endIcon={pauseLoadingModal ? <Icons.Loading /> : <></>}
              className={`w-full ${pauseLoadingModal ? "cursor-not-allowed" : ""}`}
              variant="gradient"
              title={
                onClick
                  ? t("outgoing-actions.pausing")
                  : t("outgoing-actions.yes-pause")
              }
              onClick={() => {
                dispatch(togglePauseLoadingModal(true))
                setTimeout(() => {
                  dispatch(togglePauseModal())
                  dispatch(togglePauseLoadingModal(false))
                }, 5000)
              }}
            />
          </div>
          <div className="">
            <Button
              className={`w-full `}
              disabled={pauseLoadingModal}
              title={t("outgoing-actions.no-pause")}
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
