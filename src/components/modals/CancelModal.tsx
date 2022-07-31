import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, toggleCancelModal } from "features/modals/cancelModalSlice"
import { cancelStreamNative, cancelStreamToken } from "application/normal"
import { Button, Modal } from "components/shared"
import ZebecContext from "app/zebecContext"
import * as Icons from "assets/icons"

const CancelModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const { show, loading, transaction } = useAppSelector((state) => state.cancel)

  const handleCancelTransaction = () => {
    dispatch(setLoading(true))
    // data
    const data = {
      sender: transaction.sender,
      receiver: transaction.receiver,
      escrow: transaction.pda
    }
    if (transaction.symbol === "SOL")
      stream && dispatch(cancelStreamNative(data, stream))
    else token && dispatch(cancelStreamToken(data, token))
  }

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
              onClick={handleCancelTransaction}
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
