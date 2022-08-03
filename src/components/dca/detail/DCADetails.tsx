import { useState } from "react"
import ReactTooltip from "react-tooltip"

// import { Tab } from "@headlessui/react";
import * as Icons from "assets/icons"
import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import { OverviewTab } from "./OverviewTab"
import { TransactionsTab } from "./TransactionsTab"

const categories = [
  {
    title: "overview",
    count: 0,
    icon: <Icons.EyeOpenIcon />,
    Component: <OverviewTab />
  },
  {
    title: "transactions",
    count: 3,
    icon: <Icons.TransactionIcon />,
    Component: <TransactionsTab />
  }
]

export default function DCADetails() {
  const { t } = useTranslation()
  const [activePage, setActivePage] = useState<number>(0)

  return (
    <div className="w-full pb-16 sm:px-0">
      {/* <Tab.Group> */}
      <div className="flex space-x-1 rounded-xl overflow-auto pb-2">
        {categories.map((category, index) => (
          <Tab
            key={category.title}
            type="solid"
            title={`${t(`dca:tabs.${category.title.toLowerCase()}`)}`}
            isActive={activePage === index}
            startIcon={category.icon}
            count={category.count}
            onClick={() => {
              setTimeout(() => {
                ReactTooltip.rebuild()
              }, 1000)
              setActivePage(index)
            }}
          />
        ))}
      </div>
      <div className=" mt-8">{categories[activePage].Component}</div>
    </div>
  )
}
