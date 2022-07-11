import React, { FC, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppSelector } from "app/hooks"
import { useDispatch } from "react-redux"
import { toggleCancelModal } from "features/transaction/cancelModal/cancelSlice"
import * as Icons from "assets/icons"

const CancelModal: FC = ({}) => {
  const cancelModal = useAppSelector((state) => state.cancel.cancelModal)

  const dispatch = useDispatch()
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
              className={`w-full ${onClick ? "cursor-not-allowed" : ""}`}
              variant="gradient"
              disabled={onClick}
              endIcon={onClick ? <Icons.Loading /> : <></>}
              title={
                onClick
                  ? t("outgoing-actions.cancelling")
                  : t("outgoing-actions.yes-cancel")
              }
              onClick={() => {
                setOnClick(true)
                setTimeout(() => {
                  dispatch(toggleCancelModal())
                  setOnClick(false)
                }, 5000)
              }}
            />
          </div>
          <div className="">
            <Button
              className={`w-full ${onClick ? "hidden" : ""}`}
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
