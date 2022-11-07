import { Breadcrumb } from "components/shared"
import ArchiveSafeLists from "components/treasury/archived-safes/ArchiveSafeLists"
import { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Layout from "components/layouts/Layout"

const ArchiveSafePage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <Layout pageTitle="Zebec - Archived Safes">
      <div className="pt-[76px]">
        <div className="container w-full">
          <Breadcrumb
            title={`${t("treasurySettings:archive-safe")}`}
            arrowBack={true}
            className="mb-9"
          />

          {/* Archived Safes List */}
          <ArchiveSafeLists />
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
        "archiveTreasury",
        "treasurySettings",
        "createTreasury",
        "validation"
      ]))
    }
  }
}

export default ArchiveSafePage
