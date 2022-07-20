import React, { FC, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button, Tab } from "components/shared"
import * as Icons from "assets/icons"
import { useAppDispatch } from "app/hooks"
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
  const dispatch = useAppDispatch()

  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <div className="lg:flex justify-between items-center gap-x-6 pb-10">
      {/* Filter */}
      <div className="lg:flex gap-x-2 items-center">
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

      <Button
        title={`${t("export-report")}`}
        onClick={() => {
          dispatch(toggleExportModal())
        }}
      />
    </div>
  )
}

export default FilterTabs
