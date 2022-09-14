import React, { FC } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"

import * as Icons from "assets/icons"
import {
  rejectTransaction,
  setLoading,
  toggleRejectModal
} from "features/modals/rejectModalSlice"

const RejectTransactionModal: FC = ({}) => {
  const { show, loading, transaction } = useAppSelector(
    (state) => state.rejectTransaction
  )
  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")

  const executeRejectTransaction = () => {
    dispatch(setLoading(true))
    dispatch(rejectTransaction({ uuid: transaction.uuid }))
  }

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleRejectModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold">
            {t("modal-actions.reject-modal-header")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              className={`w-full `}
              variant="danger"
              endIcon={loading ? <Icons.Loading /> : <Icons.TrashIcon />}
              disabled={loading}
              title={
                loading
                  ? `${t("modal-actions.rejecting")}`
                  : `${t("modal-actions.yes-reject")}`
              }
              onClick={executeRejectTransaction}
            />
          </div>
          <div className="">
            <Button
              className={`w-full ${loading ? "cursor-not-allowed" : ""} `}
              disabled={loading}
              title={`${t("modal-actions.no-reject")}`}
              onClick={() => {
                dispatch(toggleRejectModal())
              }}
            />
          </div>
        </>
      }
    </Modal>
  )
}
export default RejectTransactionModal
