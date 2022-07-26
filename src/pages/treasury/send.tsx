import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import Layout from "components/layouts/Layout"
import TreasuryContinuousStream from "components/send-from-treasury/TreasuryContinuousStream"
import TreasuryInstantStream from "components/send-from-treasury/TreasuryInstantStream"
import TreasuryNFTStream from "components/send-from-treasury/TreasuryNFTStream"
import { Breadcrumb, Tab } from "components/shared"
import { setTreasurySendActiveTab } from "features/common/commonSlice"
import { fetchTokensPrice } from "features/tokenDetails/tokenDetailsSlice"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useEffect } from "react"

const transferTabs = [
  {
    title: "send:continuous-stream",
    icon: <Icons.CalenderIcon />,
    count: 0,
    Component: <TreasuryContinuousStream />
  },
  {
    title: "send:instant-transfer",
    icon: <Icons.DoubleCircleDottedLineIcon />,
    count: 0,
    Component: <TreasuryInstantStream />
  },
  {
    title: "send:nft",
    icon: <Icons.SquareBlockMove />,
    count: 0,
    Component: <TreasuryNFTStream />
  }
]

const SendFromTreasury: NextPage = () => {
  const { t } = useTranslation("common")
  const activePage = useAppSelector(
    (state) => state.common.treasurySendActiveTab
  )
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchTokensPrice())
    const interval = setInterval(() => {
      dispatch(fetchTokensPrice())
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch])
  return (
    <Layout pageTitle="Zebec">
      <div className="flex justify-center border-b border-outline">
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
              onClick={() => dispatch(setTreasurySendActiveTab(index))}
              className="md:px-[107.5px]"
            />
          )
        })}
      </div>
      <div className="container">
        <Breadcrumb
          title="Zebec Safe"
          arrowBack={true}
          className="mt-10 mb-9"
        />

        {/* Active Tab */}
        {transferTabs[activePage].Component}
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "validation",
        "send"
      ]))
    }
  }
}

export default SendFromTreasury
