import Layout from "components/layouts/Layout"
import { Breadcrumb } from "components/shared"
import YeildFarmingComponent from "components/yeild-farming/YeildFarmingComponent"
import type { GetStaticProps, NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const YeildFarming: NextPage = () => {
  const { t } = useTranslation()
  return (
    <Layout pageTitle={`${t("yeildFarming:title")}`}>
      <div className="container pt-10">
        <Breadcrumb
          className="mb-0"
          title={`${t("yeildFarming:title")}`}
        ></Breadcrumb>
        <div className="text-subtitle-sm text-content-secondary pl-8 pb-6">
          {t("yeildFarming:description")}
        </div>
        <YeildFarmingComponent />
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "transactions",
        "yeildFarming"
      ]))
    }
  }
}

export default YeildFarming
