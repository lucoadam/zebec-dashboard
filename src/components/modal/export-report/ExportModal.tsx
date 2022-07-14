import React, { FC, useState } from "react"
// import { useTranslation } from "next-i18next"
import { Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"

import { toggleExportModal } from "features/export-report/exportSlice"
import DefaultExport from "./steps/DefaultExport"
import PreparingReport from "./steps/PreparingReport"
import ReadyToExport from "./steps/ReadyToExport"

interface exportStep {
  component: React.FC<exportProps>
}
export interface exportProps {
  setCurrentStep: (step: number) => void
}

export const ExportStepsList: exportStep[] = [
  {
    component: (props: exportProps) => <DefaultExport {...props} />
  },
  {
    component: (props: exportProps) => <PreparingReport {...props} />
  },
  {
    component: (props: exportProps) => <ReadyToExport {...props} />
  }
]

const ExportModal: FC = ({}) => {
  const exportModal = useAppSelector((state) => state.exportReport.exportModal)
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState(0)

  // const { t } = useTranslation("transactions")

  return (
    <Modal
      show={exportModal}
      toggleModal={() => dispatch(toggleExportModal())}
      className={`rounded h-96`}
      hasCloseIcon={!currentStep}
      size="medium"
    >
      {ExportStepsList[currentStep]?.component({
        setCurrentStep
      })}
    </Modal>
  )
}
export default ExportModal
