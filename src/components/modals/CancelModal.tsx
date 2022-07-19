import React, { FC } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"

import * as Icons from "assets/icons"
import { setLoading, toggleCancelModal } from "features/modals/cancelModalSlice"

const CancelModal: FC = ({}) => {
  const { show, loading } = useAppSelector((state) => state.cancel)

  const dispatch = useAppDispatch()

  const { t } = useTranslation("transactions")

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleCancelModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold">
            {t("modal-actions.cancel-modal-header")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              className={`w-full `}
              variant="gradient"
              disabled={loading}
              endIcon={loading ? <Icons.Loading /> : <></>}
              title={
                loading
                  ? `${t("modal-actions.cancelling")}`
                  : `${t("modal-actions.yes-cancel")}`
              }
              onClick={() => {
                dispatch(setLoading(true))
                setTimeout(() => {
                  dispatch(toggleCancelModal())
                  dispatch(setLoading(false))
                }, 5000)
              }}
            />
          </div>
          <div className="">
            <Button
              className={`w-full ${loading ? "cursor-not-allowed" : ""}`}
              disabled={loading}
              title={`${t("modal-actions.no-cancel")}`}
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
