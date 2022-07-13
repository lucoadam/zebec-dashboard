import React, { FC, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button, Tab, Modal } from "components/shared"
import * as Icons from "assets/icons"
import { ExportStepsList } from "./export-report/data"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { toggleExportModal } from "features/export-report/exportSlice"

interface FilterTabProps {
  title: string
  icon?: JSX.Element
  count?: number
}

export const filterTabs: FilterTabProps[] = [
  {
    title: "All"
  },
  {
    title: "Ongoing",
    icon: <Icons.DoubleCircleDottedLineIcon />,
    count: 3
  },
  {
    title: "Scheduled",
    icon: <Icons.CalenderIcon />,
    count: 1
  },
  {
    title: "Completed",
    icon: <Icons.CheckCircleIcon />
  }
]

const FilterTabs: FC = () => {
  const { t } = useTranslation("transactions")
  const exportModal = useAppSelector((state) => state.exportReport.exportModal)
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)

  function toggleModal() {
    setIsOpen(!isOpen)
  }

  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <div className="flex justify-between items-center gap-x-6 pb-10">
      {/* Filter */}
      <div className="flex gap-x-2 items-center">
        {filterTabs.map((filterTab, index) => {
          return (
            <Tab
              key={filterTab.title}
              isActive={activeTab === index}
              title={`${t(filterTab.title.toLowerCase())}`}
              type="solid"
              count={filterTab.count}
              startIcon={filterTab.icon}
              onClick={() => setActiveTab(index)}
            />
          )
        })}
      </div>
      {/* Export */}
      <Modal
        show={currentStep >= 0 && exportModal}
        toggleModal={() => dispatch(toggleExportModal())}
        className={`rounded h-96`}
        hasCloseIcon={!currentStep}
        size="small"
      >
        {ExportStepsList[currentStep]?.component({
          setCurrentStep
        })}
      </Modal>
      <Button
        title={`${t("export-report")}`}
        onClick={() => {
          setCurrentStep(0)
          dispatch(toggleExportModal())
        }}
      />
    </div>
  )
}

export default FilterTabs
