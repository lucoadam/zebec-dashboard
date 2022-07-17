import React, { FC } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"

import * as Icons from "assets/icons"
import { setLoading, toggleSignModal } from "features/modals/signModalSlice"

const SignTransactionModal: FC = ({}) => {
  const { show, loading } = useAppSelector((state) => state.signTransaction)
  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")
  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleSignModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold">
            {t("modal-actions.sign-modal-header")}
          </div>
          <div className="pt-[12px] pb-[12px]">
            <Button
              className={`w-full `}
              variant="gradient"
              endIcon={loading ? <Icons.Loading /> : <></>}
              disabled={loading}
              title={
                loading
                  ? `${t("modal-actions.signing")}`
                  : `${t("modal-actions.yes-sign")}`
              }
              onClick={() => {
                dispatch(setLoading(true))
                setTimeout(() => {
                  dispatch(toggleSignModal())
                  dispatch(setLoading(false))
                }, 5000)
              }}
            />
          </div>
          <div className="">
            <Button
              className={`w-full ${loading ? "cursor-not-allowed" : ""} `}
              disabled={loading}
              title={`${t("modal-actions.no-sign")}`}
              onClick={() => {
                dispatch(toggleSignModal())
              }}
            />
          </div>
        </>
      }
    </Modal>
  )
}
export default SignTransactionModal
