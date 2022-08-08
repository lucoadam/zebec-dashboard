import { Breadcrumb } from "components/shared"
import DepositNFT from "components/treasury/detail/components/DepositNFT"
import { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Layout from "../../components/layouts/Layout"

const DepositNFTPage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <Layout pageTitle="Zebec - Create Treasury">
      <div className="pt-[76px]">
        <div className="container w-full">
          <Breadcrumb
            title={`${t("treasury:deposit-nft-in")} ${t("treasury:title")}`}
            arrowBack={true}
            className="mb-9"
          />

          <DepositNFT />
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
        "validation"
      ]))
    }
  }
}

export default DepositNFTPage
