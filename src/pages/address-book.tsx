import type { NextPage } from "next"
import { useState } from "react"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Layout from "components/layouts/Layout"
import { Tab } from "components/shared"
import * as Icons from "../assets/icons"
import IndividualAddresses from "components/address-book/IndividualAddreses"
import AddressesGroup from "components/address-book/AddressesGroup"

const addressBookTabs = [
  {
    title: "Individual Addresses",
    icon: <Icons.IndividualAddress />,
    Component: <IndividualAddresses />
  },
  {
    title: "Address Groups",
    icon: <Icons.AddressGroup />,
    Component: <AddressesGroup />
  }
]

const AddressBook: NextPage = () => {
  const { t } = useTranslation("transactions")

  const [activePage, setActivePage] = useState<number>(0)

  return (
    <>
      <Layout pageTitle="Zebec -Transactions">
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

export async function getStaticProps({ locale }: any) {
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
