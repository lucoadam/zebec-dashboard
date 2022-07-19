import Layout from "components/layouts/Layout"
import { Tab } from "components/shared"
import Incoming from "components/transactions/Incoming"
import Outgoing from "components/transactions/Outgoing"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import * as Icons from "../assets/icons"
import CancelModal from "components/modals/CancelModal"
import PauseModal from "components/modals/PauseModal"
import ResumeModal from "components/modals/ResumeModal"
import StakeModal from "components/modals/StakeModal"
import UnstakeModal from "components/modals/UnstakeModal"
import HarvestModal from "components/modals/HarvestModal"

const transactionTabs = [
  {
    title: "Incoming",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <Incoming />
  },
  {
    title: "Outgoing",
    icon: <Icons.ArrowUpRightIcon />,
    count: 2,
    Component: <Outgoing />
  }
]

const Transactions: NextPage = () => {
  const { t } = useTranslation("transactions")

  const [activePage, setActivePage] = useState<number>(0)

  useEffect(() => {
    setTimeout(() => {
      ReactTooltip.rebuild()
    }, 200)
    console.log("rebuild")
  }, [activePage])

  return (
    <>
      <Layout pageTitle="Zebec -Transactions">
        <div className="flex justify-center border-b border-outline">
          {/* Tabs */}
          {transactionTabs.map((transactionTab, index) => {
            return (
              <Tab
                key={transactionTab.title}
                type="plain"
                title={`${t(transactionTab.title.toLowerCase())}`}
                isActive={activePage === index}
                startIcon={transactionTab.icon}
                count={transactionTab.count}
                onClick={() => setActivePage(index)}
              />
            )
          })}
        </div>
        <div className="container py-10">
          {/* Active Tab */}
          {transactionTabs[activePage].Component}
        </div>
        <PauseModal />
        <ResumeModal />
        <CancelModal />
        <StakeModal/>
        <UnstakeModal/>
        <HarvestModal/>
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "transactions",
        "validation",
        "exportReport"
      ]))
    }
  }
}

export default Transactions
