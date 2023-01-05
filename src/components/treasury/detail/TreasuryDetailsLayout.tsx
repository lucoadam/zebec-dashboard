import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  Breadcrumb,
  BreadcrumbRightContent,
  Button,
  CollapseDropdown,
  Tab
} from "components/shared"
import Link from "next/link"
import { useRef, useState } from "react"
import * as Icons from "assets/icons"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { setTreasurySendActiveTab } from "features/common/commonSlice"
import Overview from "./components/overview/Overview"
import Transactions from "./components/transactions/Transactions"
import Setting from "./components/settings/Setting"
import { useClickOutside } from "hooks"
import { NFTsList } from "./components/nfts/NFTsList"

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
    title: "nft",
    icon: <Icons.SquareBlockMove />,
    Component: <NFTsList />
  },
  {
    title: "settings",
    icon: <Icons.GearringIcon />,
    Component: <Setting />
  }
]

const TreasuryDetailsLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { slug } = router.query
  const { t } = useTranslation()
  const dropdownWrapperRef = useRef(null)
  const dispatch = useAppDispatch()
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const [toggleDropdown, setToggleDropdown] = useState(false)

  //Get current path name [last key of pathname]
  const currentPath = router.asPath.split("/").slice(-1)[0]

  useClickOutside(dropdownWrapperRef, {
    onClickOutside: () => {
      setToggleDropdown(false)
    }
  })

  return (
    <>
      <div className="pt-[76px]">
        <div className="container">
          <Breadcrumb
            title={activeTreasury?.name || ""}
            arrowBack={true}
            backTo="/treasury"
            className="md:flex"
          >
            <BreadcrumbRightContent>
              {/* Deposit NFT and Send from treasury */}
              <div className="flex gap-4">
                <Link href={`/treasury/${slug}/deposit-nft`}>
                  <Button
                    title={`${t("treasury:deposit-nft")}`}
                    endIcon={<Icons.PlusIncircleIcon />}
                    type="button"
                  />
                </Link>
                <div ref={dropdownWrapperRef} className="relative">
                  <Button
                    title={`${t("send:send-from-treasury-vault")}`}
                    variant="gradient"
                    endIcon={<Icons.ArrowUpRightIcon />}
                    onClick={() => setToggleDropdown(!toggleDropdown)}
                  />
                  <CollapseDropdown
                    className="p-2 mt-4 w-[232px]"
                    position="right"
                    show={toggleDropdown}
                  >
                    <div className="pb-2">
                      <Link href={`/treasury/${slug}/send`}>
                        <div
                          onClick={() => dispatch(setTreasurySendActiveTab(0))}
                          className="flex gap-2 px-5 py-3 items-center hover:bg-background-tertiary rounded-lg cursor-pointer text-content-primary"
                        >
                          <Icons.DoubleCircleDottedLineIcon className="w-6 h-6" />
                          <span>{t("send:continuous-stream")}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="py-2">
                      <Link href={`/treasury/${slug}/send`}>
                        <div
                          onClick={() => dispatch(setTreasurySendActiveTab(1))}
                          className="flex gap-2 px-5 py-3 text-content-primary items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                        >
                          <Icons.ThunderIcon className="w-6 h-6" />
                          <span>{t("send:instant-transfer")}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="pt-2">
                      <Link href={`/treasury/${slug}/send`}>
                        <div
                          onClick={() => dispatch(setTreasurySendActiveTab(2))}
                          className="flex gap-2 px-5 py-3 text-content-primary items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                        >
                          <Icons.SquareBlockMove className="w-6 h-6" />
                          <span>{t("send:nft")}</span>
                        </div>
                      </Link>
                    </div>
                  </CollapseDropdown>
                </div>
              </div>
            </BreadcrumbRightContent>
          </Breadcrumb>

          {/* Tabs */}
          <div className="w-full pb-16 sm:px-0">
            {/* <Tab.Group> */}
            <div className="flex space-x-1 rounded-xl overflow-auto pb-2">
              {categories.map((category) => (
                <Tab
                  key={category.title}
                  type="solid"
                  title={`${t(`treasury:${category.title.toLowerCase()}`)}`}
                  isActive={
                    currentPath === slug
                      ? category.title === "overview"
                      : currentPath === "settings"
                      ? category.title === "settings"
                      : currentPath === "nft"
                      ? category.title === "nft"
                      : category.title === "transactions"
                  }
                  startIcon={category.icon}
                  onClick={() => {
                    router.push(
                      `/treasury/${slug}/${
                        category.title === "overview" ? "" : category.title
                      }`
                    )
                  }}
                />
              ))}
            </div>
            {/* Tab Component */}
            <div className=" mt-8">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TreasuryDetailsLayout
