import { CreateDCA } from "components/dca/create"
import Layout from "components/layouts/Layout"
import { Breadcrumb } from "components/shared"
import { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const CreateDCAPage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <Layout pageTitle="Zebec - Create DCA">
      <div className="pt-[76px]">
        <div className="container w-full">
          <Breadcrumb
            title={`${t("common:dca")}`}
            arrowBack={true}
            className="mb-9 uppercase"
          />

          <CreateDCA />
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
        "dca",
        "createDCA",
        "validation"
      ]))
    }
  }
}

export default CreateDCAPage
