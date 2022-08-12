import Layout from "components/layouts/Layout"
import { SettingsComponent } from "components/settings/SettingsComponent"
import { NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import * as React from "react"

const Settings: NextPage = () => {
  return (
    <>
      <Layout pageTitle="Zebec -Transactions">
        <SettingsComponent />
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

export default Settings
