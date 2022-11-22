import { Breadcrumb } from "components/shared"
import DepositNFT from "components/treasury/detail/components/DepositNFT"
import { useZebecWallet } from "hooks/useWallet"
import { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Layout from "../../components/layouts/Layout"

const DepositNFTPage: NextPage = () => {
  const { t } = useTranslation()
  const history = useRouter()
  const walletObject = useZebecWallet()

  useEffect(() => {
    if (walletObject.chainId !== "solana") {
      history.replace("/")
    }
  }, [walletObject, history])
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
