import * as Icons from "assets/icons"
import Layout from "components/layouts/Layout"
import { IconButton, Tab } from "components/shared"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import TreasuryContinuousStream from "components/sendFromTreasury/treasuryContinuousStream"
import TreasuryInstantStream from "components/sendFromTreasury/treasuryInstantStream"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setTreasurySendActiveTab } from "features/common/commonSlice"
import { useRouter } from "next/router"

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
  }
]

const SendFromTreasury: NextPage = () => {
  const { t } = useTranslation("common")
  const activePage = useAppSelector(
    (state) => state.common.treasurySendActiveTab
  )
  const dispatch = useAppDispatch()
  const router = useRouter()

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
        <div className="flex justify-start items-center py-10">
          <IconButton
            className="cursor-pointer mr-[19px]"
            onClick={() => {
              router.back()
            }}
            variant="plain"
            icon={<Icons.LeftArrowIcon />}
          />

          <h4 className="text-heading-4 font-semibold text-content-primary">
            Zebec Safe
          </h4>
        </div>
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
