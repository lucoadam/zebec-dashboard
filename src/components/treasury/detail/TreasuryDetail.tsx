import { useState } from "react"
import ReactTooltip from "react-tooltip"
import * as Icons from "assets/icons"
import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import Overview from "./components/Overview"
import RejectTransactionModal from "components/modals/RejectTransactionModal"
import SignTransactionModal from "components/modals/SignTransactionModal"
// import { NFTsList } from "./components/NFTsList"
import Setting from "./components/Setting"
// import { Transactions } from "./components/Transactions"

const categories = [
  {
    title: "overview",
    count: 0,
    icon: <Icons.EyeOpenIcon />,
    Component: <Overview />
  },
  {
    title: "settings",
    count: 0,
    icon: <Icons.GearringIcon />,
    Component: <Setting />
  }
  // {
  //   title: "transactions",
  //   count: 3,
  //   icon: <Icons.TransactionIcon />,
  //   Component: <Transactions />
  // },
  // {
  //   title: "nft",
  //   count: 0,
  //   icon: <Icons.SquareBlockMove />,
  //   Component: <NFTsList />
  // },
]

export default function TreasuryDetail() {
  const { t } = useTranslation()
  const [activePage, setActivePage] = useState<number>(0)

  return (
    <>
      <div className="w-full pb-16 sm:px-0">
        {/* <Tab.Group> */}
        <div className="flex space-x-1 rounded-xl overflow-auto pb-2">
          {categories.map((category, index) => (
            <Tab
              key={category.title}
              type="solid"
              title={`${t(`treasury:${category.title.toLowerCase()}`)}`}
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
      {/* Sign Reject Modals */}
      <SignTransactionModal />
      <RejectTransactionModal />
    </>
  )
}
