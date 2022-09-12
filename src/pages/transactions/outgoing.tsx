import Layout from "components/layouts/Layout"
import CancelModal from "components/modals/CancelModal"
import PauseModal from "components/modals/PauseModal"
import ResumeModal from "components/modals/ResumeModal"
import { Tab } from "components/shared"
import Outgoing from "components/transactions/outgoing/Outgoing"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useEffect } from "react"
import ReactTooltip from "react-tooltip"
import * as Icons from "assets/icons"
import { useRouter } from "next/router"

const transactionTabs = [
  {
    title: "Incoming",
    icon: <Icons.ArrowDownLeftIcon />
  },
  {
    title: "Outgoing",
    icon: <Icons.ArrowUpRightIcon />
  }
]

const Transactions: NextPage = () => {
  const { t } = useTranslation("transactions")
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      ReactTooltip.rebuild()
    }, 200)
  }, [])

  return (
    <>
      <Layout pageTitle="Zebec -Transactions">
        <div className="flex justify-center border-b border-outline">
          {/* Tabs */}
          {transactionTabs.map((transactionTab) => {
            return (
              <Tab
                key={transactionTab.title}
                type="plain"
                title={`${t(transactionTab.title.toLowerCase())}`}
                isActive={transactionTab.title === "Outgoing"}
                startIcon={transactionTab.icon}
                onClick={() =>
                  router.push(
                    `/transactions/${transactionTab.title.toLowerCase()}`
                  )
                }
              />
            )
          })}
        </div>
        <div className="container py-10">
          <Outgoing />
        </div>
        <PauseModal />
        <ResumeModal />
        <CancelModal />
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
        "exportReport",
        "addressBook"
      ]))
    }
  }
}

export default Transactions
