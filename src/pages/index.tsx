import HomePage from "components/home"
import Layout from "components/layouts/Layout"
import type { GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const Home: NextPage = () => {
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
        "transactions",
        "validation"
      ]))
    }
  }
}

export default Home
