import type { NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Layout from "components/layouts/Layout"
import NotificationsComponent from "components/notifications/Notifications"

const Transactions: NextPage = () => {
  return (
    <>
      <Layout pageTitle="Zebec -Notifications">
        <NotificationsComponent />
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "validation"]))
    }
  }
}

export default Transactions
