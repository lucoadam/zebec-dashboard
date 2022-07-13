import React, { FC, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button } from "components/shared"
import { Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"

import * as Icons from "assets/icons"
import { setLoading, togglePauseModal } from "features/modals/pauseModal/pauseModalSlice"

const PauseModal: FC = ({}) => {
  const show = useAppSelector((state) => state.pause.show)
  const loading = useAppSelector((state) => state.pause.loading)
  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")
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
            {t("outgoing-actions.pause-modal-header")}
          </div>
          <div className="pt-[12px] pb-[12px]">
            <Button
              disabled={loading}
              endIcon={loading ? <Icons.Loading /> : <></>}
              className={`w-full `}
              variant="gradient"
              title={
                loading
                  ? t("outgoing-actions.pausing")
                  : t("outgoing-actions.yes-pause")
              }
              onClick={() => {
                dispatch(setLoading(true))
                setTimeout(() => {
                  dispatch(togglePauseModal())
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
