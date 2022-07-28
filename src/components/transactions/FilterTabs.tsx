import { useAppDispatch } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, Tab } from "components/shared"
import { toggleExportModal } from "features/export-report/exportSlice"
import { useTranslation } from "next-i18next"
import { FC, useState } from "react"

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
    <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-4 pb-10">
      {/* Filter */}
      <div className="flex gap-x-2 items-center overflow-x-auto">
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
