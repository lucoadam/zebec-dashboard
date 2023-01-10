import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import TreasuryContinuousStream from "components/send-from-treasury/TreasuryContinuousStream"
import TreasuryInstantStream from "components/send-from-treasury/TreasuryInstantStream"
import TreasuryNFTStream from "components/send-from-treasury/TreasuryNFTStream"
import { Breadcrumb, Tab } from "components/shared"
import TreasuryLayout from "components/treasury/detail/TreasuryLayout"
import { setTreasurySendActiveTab } from "features/common/commonSlice"
import type { GetStaticPaths, NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { useEffect } from "react"

const transferTabs = [
  {
    key: "continuous-stream",
    title: "send:continuous-stream",
    icon: <Icons.CalenderIcon />,
    count: 0,
    Component: <TreasuryContinuousStream />
  },
  {
    key: "instant-transfer",
    title: "send:instant-transfer",
    icon: <Icons.DoubleCircleDottedLineIcon />,
    count: 0,
    Component: <TreasuryInstantStream />
  },
  {
    key: "nft",
    title: "send:nft",
    icon: <Icons.SquareBlockMove />,
    count: 0,
    Component: <TreasuryNFTStream />
  }
]

const SendFromTreasury: NextPage = () => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const { slug } = router.query
  const dispatch = useAppDispatch()
  const activePage = useAppSelector(
    (state) => state.common.treasurySendActiveTab
  )
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  useEffect(() => {
    const currentPath = router.asPath
    const currentActiveTab = currentPath.split("#")[1]
    if (currentActiveTab) {
      const currentTabIndex = transferTabs.findIndex(
        (element) => element.key === currentActiveTab
      )
      if (currentTabIndex === -1) {
        router.push("/404")
      } else {
        dispatch(setTreasurySendActiveTab(currentTabIndex))
      }
    } else {
      dispatch(setTreasurySendActiveTab(0))
    }
    // eslint-disable-next-line
  }, [activePage, router.asPath])

  // const history = useRouter()
  // const walletObject = useZebecWallet()

  // useEffect(() => {
  //   if (walletObject.connected && walletObject.chainId !== "solana") {
  //     history.replace("/")
  //   }
  // }, [walletObject, history])

  return (
    <TreasuryLayout pageTitle="Zebec - Treasury Send">
      <div className="ml-2 flex justify-center overflow-x-auto overflow-y-hidden border-b border-outline">
        {/* Tabs */}
        {transferTabs.map((transactionTab, index) => {
          return (
            <Tab
              key={transactionTab.title}
              type="plain"
              title={`${t(transactionTab.title.toLowerCase())}`}
              isActive={activePage === index}
              startIcon={transactionTab.icon}
              count={transactionTab.count}
              onClick={() => {
                dispatch(setTreasurySendActiveTab(index))
                if (transactionTab.key === transferTabs[0].key) {
                  router.push(`/treasury/${slug}/send`)
                } else {
                  router.push(`#${transactionTab.key}`, undefined, {
                    shallow: true
                  })
                }
              }}
              className="md:px-[108px]"
            />
          )
        })}
      </div>
      <div className="container">
        <Breadcrumb
          title={activeTreasury?.name || ""}
          arrowBack={true}
          className="mt-10 mb-9"
          backTo={`/treasury/${slug}`}
        />

        {/* Active Tab */}
        {transferTabs[activePage].Component}
      </div>
    </TreasuryLayout>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "validation",
        "send",
        "treasury",
        "createTreasury"
      ]))
    }
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export default SendFromTreasury
