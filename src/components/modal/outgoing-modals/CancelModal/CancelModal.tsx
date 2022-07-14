import React, { FC } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"

import * as Icons from "assets/icons"
import {
  setLoading,
  toggleCancelModal
} from "features/modals/cancelModal/cancelModalSlice"

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
            {t("outgoing-actions.cancel-modal-header")}
          </div>
          <div className="pt-[12px] pb-[12px]">
            <Button
              className={`w-full `}
              variant="gradient"
              disabled={loading}
              endIcon={loading ? <Icons.Loading /> : <></>}
              title={
                loading
                  ? t("outgoing-actions.cancelling")
                  : t("outgoing-actions.yes-cancel")
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
