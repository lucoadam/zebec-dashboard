import { Breadcrumb } from "components/shared"
import { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Layout from "../../components/layouts/Layout"
import CreateTreasury from "../../components/treasury/create/CreateTreasury"

const CreateTreasuryPage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <Layout pageTitle="Zebec - Create Treasury">
      <div className="pt-[76px]">
        <div className="container w-full">
          <Breadcrumb
            title={`${t("common:create-new")} ${t("treasury:title")}`}
            arrowBack={true}
            className="mb-9"
          />

          <CreateTreasury />
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "treasury",
        "createTreasury",
        "validation"
      ]))
    }
  }
}

export default CreateTreasuryPage
