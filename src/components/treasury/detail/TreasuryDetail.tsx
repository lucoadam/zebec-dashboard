import { useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import * as Icons from "assets/icons"
import { Tab } from "components/shared"
import { useTranslation } from "next-i18next"
import Overview from "./components/overview/Overview"
// import { NFTsList } from "./components/nfts/NFTsList"
import Setting from "./components/settings/Setting"
import Transactions from "./components/transactions/Transactions"
import { useRouter } from "next/router"

const categories = [
  {
    title: "overview",
    icon: <Icons.EyeOpenIcon />,
    Component: <Overview />
  },
  {
    title: "transactions",
    icon: <Icons.TransactionIcon />,
    Component: <Transactions />
  },
  {
    title: "settings",
    icon: <Icons.GearringIcon />,
    Component: <Setting />
  }
  // {
  //   title: "nft",
  //   count: 0,
  //   icon: <Icons.SquareBlockMove />,
  //   Component: <NFTsList />
  // }
]

export default function TreasuryDetail() {
  const { t } = useTranslation()
  const router = useRouter()
  const [activePage, setActivePage] = useState<number>(0)

  useEffect(() => {
    const currentPath = router.asPath
    const currentActiveTab = currentPath.split("#")[1]
    if (currentActiveTab) {
      const currentTabIndex = categories.findIndex(
        (element) => element.title === currentActiveTab
      )
      setActivePage(currentTabIndex)
      setTimeout(() => {
        ReactTooltip.rebuild()
      }, 1000)
    } else {
      setActivePage(0)
    }
  }, [router.asPath])

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
              onClick={() => {
                setTimeout(() => {
                  ReactTooltip.rebuild()
                }, 1000)
                setActivePage(index)
                router.push(`#${category.title}`, undefined, { shallow: false })
              }}
            />
          ))}
        </div>
        <div className=" mt-8">{categories[activePage].Component}</div>
      </div>
    </>
  )
}
