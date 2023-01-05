import TreasuryDetailsLayout from "components/treasury/detail/TreasuryDetailsLayout"
import TreasuryLayout from "components/treasury/detail/TreasuryLayout"
import { NFTsList } from "components/treasury/detail/components/nfts/NFTsList"
import { NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const TreasyryNFT: NextPage = () => {
  return (
    <>
      <TreasuryLayout pageTitle="Zebec - Treasury NFTs">
        <TreasuryDetailsLayout>
          {/* NFTs List */}
          <NFTsList />
        </TreasuryDetailsLayout>
      </TreasuryLayout>
    </>
  )
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "treasury",
        "treasuryOverview",
        "treasurySettings",
        "validation",
        "transactions",
        "exportReport",
        "send"
      ]))
    }
  }
}

export default TreasyryNFT
