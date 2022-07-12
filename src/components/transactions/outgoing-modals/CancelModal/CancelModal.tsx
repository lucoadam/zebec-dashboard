import React, { FC, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  toggleCancelLoading,
  toggleCancelModal
} from "features/transaction/cancelModal/cancelSlice"
import * as Icons from "assets/icons"

const CancelModal: FC = ({}) => {
  const cancelModal = useAppSelector((state) => state.cancel.cancelModal)
  const cancelLoadingModal = useAppSelector(
    (state) => state.cancel.cancelLoading
  )

  const dispatch = useAppDispatch()
  const [onClick, setOnClick] = useState(false)
  const { t } = useTranslation("transactions")

  return (
    <Modal
      show={cancelModal}
      toggleModal={() => dispatch(toggleCancelModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold">
            {t("outgoing-actions.cancel-modal-header")}
          </div>
          <div className="pt-[12px] pb-[12px]">
            <Button
              className={`w-full `}
              variant="gradient"
              disabled={cancelLoadingModal}
              endIcon={cancelLoadingModal ? <Icons.Loading /> : <></>}
              title={
                cancelLoadingModal
                  ? t("outgoing-actions.cancelling")
                  : t("outgoing-actions.yes-cancel")
              }
              onClick={() => {
                dispatch(toggleCancelLoading(true))
                setTimeout(() => {
                  dispatch(toggleCancelModal())
                  dispatch(toggleCancelLoading(false))
                }, 5000)
              }}
            />
          </div>
          <div className="">
            <Button
              className={`w-full ${
                cancelLoadingModal ? "cursor-not-allowed" : ""
              }`}
              disabled={cancelLoadingModal}
              title={t("outgoing-actions.no-cancel")}
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
