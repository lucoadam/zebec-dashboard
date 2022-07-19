import { useState } from "react"
import ReactTooltip from "react-tooltip"

// import { Tab } from "@headlessui/react";
import * as Icons from "assets/icons"
import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import { Farms } from "./components/Farms"

const categories = [
  {
    title: "all-farms",
    count: 0
  },
  {
    title: "staked-farms",
    count: 3,
    icon: <Icons.DoubleCircleDottedLineIcon />
  }
]

export default function YeildFarmingComponent() {
  const { t } = useTranslation()
  const [activePage, setActivePage] = useState<number>(0)

  return (
    <div className="w-full pb-16 sm:px-0">
      {/* <Tab.Group> */}
      <div className="flex max-w-md space-x-1 rounded-xl">
        {categories.map((category, index) => (
          <Tab
            key={category.title}
            type="solid"
            title={`${t(`yeildFarming:${category.title.toLowerCase()}`)}`}
            isActive={activePage === index}
            startIcon={category.icon}
            count={category.count}
            onClick={() => {
              console.log("clicked")
              setTimeout(() => {
                ReactTooltip.rebuild()
              }, 1000)
              setActivePage(index)
            }}
          />
        ))}
      </div>
      <div className=" mt-8">
        <Farms />
      </div>
    </div>
  )
}
