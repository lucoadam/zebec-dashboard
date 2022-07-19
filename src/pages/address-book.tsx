import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Layout from "components/layouts/Layout"
import { Tab } from "components/shared"
import * as Icons from "../assets/icons"
import IndividualAddresses from "components/address-book/IndividualAddreses"
import AddressesGroup from "components/address-book/AddressesGroup"
import ReactTooltip from "react-tooltip"

const addressBookTabs = [
  {
    title: "Individual Addresses",
    icon: <Icons.IndividualAddress />,
    Component: <IndividualAddresses />
  },
  {
    title: "Address Groups",
    icon: <Icons.UserGroupIcon />,
    Component: <AddressesGroup />
  }
]

const AddressBook: NextPage = () => {
  const { t } = useTranslation("transactions")

  const [activePage, setActivePage] = useState<number>(0)
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [activePage])
  

  return (
    <>
      <Layout pageTitle="Zebec -Address Book">
        <div className="flex justify-center border-b border-outline">
          {/* Tabs */}
          {addressBookTabs.map((addressBookTab, index) => {
            return (
              <Tab
                key={addressBookTab.title}
                type="plain"
                title={`${t(addressBookTab.title)}`}
                isActive={activePage === index}
                startIcon={addressBookTab.icon}
                onClick={() => setActivePage(index)}
              />
            )
          })}
        </div>
        <div className="container py-10">
          {/* Active Tab */}
          {addressBookTabs[activePage].Component}
        </div>
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
        "addressBook"
      ]))
    }
  }
}

export default AddressBook
