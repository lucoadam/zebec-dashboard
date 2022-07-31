import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, togglePauseModal } from "features/modals/pauseModalSlice"
import { pauseStreamNative, pauseStreamToken } from "application/normal"
import { Modal, Button } from "components/shared"
import ZebecContext from "app/zebecContext"
import * as Icons from "assets/icons"

const PauseModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const { show, loading, transaction } = useAppSelector((state) => state.pause)

  const handlePauseTransaction = () => {
    dispatch(setLoading(true))
    // data
    const data = {
      sender: transaction.sender,
      receiver: transaction.receiver,
      escrow: transaction.pda
    }
    if (transaction.symbol === "SOL")
      stream && dispatch(pauseStreamNative(data, stream))
    else token && dispatch(pauseStreamToken(data, token))
  }

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
              onClick={handlePauseTransaction}
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
