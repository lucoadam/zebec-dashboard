import HomePage from "components/home"
import Layout from "components/layouts/Layout"
import type { GetStaticProps, NextPage } from "next"
// import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const Home: NextPage = () => {
  // const { t } = useTranslation("common")

  return (
    <Layout pageTitle="Zebec">
      <div className="container pt-10">
        <HomePage />
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "home",
        "treasuryOverview",
        "transactions"
      ]))
    }
  }
}

export default Home
