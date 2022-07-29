import React, { FC } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { Modal } from "components/shared"
import * as Icons from "assets/icons"

export const WalletApprovalMessageModal: FC = () => {
  const dispatch = useAppDispatch()
  const { show } = useAppSelector((state) => state.walletApprovalMessage)

  const { t } = useTranslation("common")

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleWalletApprovalMessageModal())}
      size="medium"
      className="modal-gradient-border p-0"
    >
      <div className="flex flex-col gap-y-4 py-16 px-8">
        <p className=" text-subtitle text-content-primary font-semibold text-center">
          {t("modal-actions.wallet-approval-message")}
        </p>
        <div className="flex items-center gap-x-1 justify-center text-warning">
          <Icons.SparkleIcon className="text-base opacity-100" />{" "}
          <p className="text-body">
            {t("modal-actions.do-not-close-this-window")}
          </p>
        </div>
      </div>
    </Modal>
  )
}
