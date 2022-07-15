import { useState } from "react"
// import { Tab } from "@headlessui/react";
import * as Icons from "assets/icons"
import Setting from "./components/Setting"
import Overview from "./components/Overview"
import { useTranslation } from "next-i18next"
import { Tab } from "components/shared"
import { Transactions } from "./components/Transactions"

const categories = [
  {
    title: "overview",
    count: 0,
    icon: <Icons.EyeOpenIcon />,
    Component: <Overview />
  },
  {
    title: "transactions",
    count: 3,
    icon: <Icons.TransactionIcon />,
    Component: <Transactions />
  },
  {
    title: "settings",
    count: 0,
    icon: <Icons.GearringIcon />,
    Component: <Setting />
  }
]

export default function TreasuryDetail() {
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
            className="w-1/2"
            title={`${t(`treasury:${category.title.toLowerCase()}`)}`}
            isActive={activePage === index}
            startIcon={category.icon}
            count={category.count}
            onClick={() => setActivePage(index)}
          />
        ))}
      </div>
      <div className=" mt-8">{categories[activePage].Component}</div>
    </div>
  )
}
