import React, { FC } from "react"
import { useTranslation } from "next-i18next"
import { Button } from "components/shared"
import { Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"

import * as Icons from "assets/icons"
import { setLoading, togglePauseModal } from "features/modals/pauseModalSlice"

const PauseModal: FC = ({}) => {
  const { show, loading } = useAppSelector((state) => state.pause)

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
            {t("modal-actions.pause-modal-header")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              disabled={loading}
              endIcon={loading ? <Icons.Loading /> : <></>}
              className={`w-full `}
              variant="gradient"
              title={
                loading
                  ? `${t("modal-actions.pausing")}`
                  : `${t("modal-actions.yes-pause")}`
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
              className={`w-full ${loading ? "cursor-not-allowed" : ""} `}
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
