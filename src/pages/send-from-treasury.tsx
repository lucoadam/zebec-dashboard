import * as Icons from "assets/icons"
import Layout from "components/layouts/Layout"
import { Tab } from "components/shared"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useState } from "react"
import TreasuryContinuousStream from "components/sendFromTreasury/treasuryContinuousStream"

const transferTabs = [
  {
    title: "Continuous Stream",
    icon: <Icons.CalenderIcon />,
    count: 0,
    Component: <TreasuryContinuousStream />
  },
  {
    title: "Instant Transfer",
    icon: <Icons.DoubleCircleDottedLineIcon />,
    count: 0,
    Component: <div> Instant Transfer </div>
  }
]

const SendFromTreasury: NextPage = () => {
  const { t } = useTranslation("common")
  const [activePage, setActivePage] = useState<number>(0)

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
              onClick={() => setActivePage(index)}
              className="md:px-[107.5px]"
            />
          )
        })}
      </div>
      <div className="container py-10">
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
