import React, { FC } from "react"
// import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { togglexWalletApprovalMessageModal } from "features/modals/xWalletApprovalMessageSlice"
import { Modal } from "components/shared"
import * as Icons from "assets/icons"

export const XWalletApprovalMessageModal: FC = () => {
  const dispatch = useAppDispatch()
  const { show, step } = useAppSelector((state) => state.xWalletApprovalMessage)

  // const { t } = useTranslation("common")

  const getStepState = (index: number, isIcon = false) => {
    if (index === step) {
      return isIcon ? index + 1 : "bg-primary"
    }
    if (index < step) {
      return isIcon ? <Icons.CheckIcon /> : "bg-success"
    }
    return isIcon ? index + 1 : "bg-content-contrast"
  }
  const StepsList = [
    {
      name: "Approve Deposit"
    },
    {
      name: "Transfer to PDA"
    },
    {
      name: "Transfer to Zebec Vault"
    }
  ]
  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(togglexWalletApprovalMessageModal())}
      size="medium"
      className="modal-gradient-border p-0"
    >
      <div className="flex-none px-6 py-[50px]">
        {StepsList.map((item, index) => (
          <div
            className={`steps-container-modal flex mb-[20px] ${
              StepsList.length - 1 === index ? "last" : ""
            }`}
            key={`steps-${index}`}
          >
            <div
              className={`w-[24px] flex justify-center items-center text-center h-[24px] self-center mr-2 rounded-full ${getStepState(
                index
              )} text-xs text-content-primary`}
            >
              {getStepState(index, true)}
            </div>
            <div className="flex gap-2 items-center">
              <h4 className="leading-6 font-medium text-sm text-content-primary">
                {item.name}
              </h4>
              {step === index && (
                <Icons.Loading className="text-content-primary" />
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-x-[6px] justify-center text-warning">
          <Icons.SparkleIcon className="text-base opacity-100 w-4 h-4" />{" "}
          <p className="text-body">
            Please complete all steps to ensure successful deposit of funds to
            your zebec vault
          </p>
        </div>
      </div>
    </Modal>
  )
}
