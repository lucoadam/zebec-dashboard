import { Breadcrumb } from "components/shared"
import DepositNFT from "components/treasury/detail/components/deposit-nfts/DepositNFT"
// import { useZebecWallet } from "hooks/useWallet"
import { GetStaticPaths, NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
// import { useRouter } from "next/router"
// import { useEffect } from "react"
// import Layout from "components/layouts/Layout"
import TreasuryLayout from "components/treasury/detail/TreasuryLayout"

const DepositNFTPage: NextPage = () => {
  const { t } = useTranslation()
  // const history = useRouter()
  // const walletObject = useZebecWallet()

  // useEffect(() => {
  //   if (walletObject.connected && walletObject.chainId !== "solana") {
  //     history.replace("/")
  //   }
  // }, [walletObject, history])

  return (
    <TreasuryLayout pageTitle="Zebec - Deposit NFT  ">
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
    </TreasuryLayout>
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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export default DepositNFTPage
