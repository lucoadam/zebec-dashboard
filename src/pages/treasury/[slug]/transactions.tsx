import Transactions from "components/treasury/detail/components/transactions/Transactions"
import TreasuryDetailsLayout from "components/treasury/detail/TreasuryDetailsLayout"
import TreasuryLayout from "components/treasury/detail/TreasuryLayout"
import { NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const TreasyryTransactions: NextPage = () => {
  return (
    <>
      <TreasuryLayout pageTitle="Zebec - Treasury Transactions">
        <TreasuryDetailsLayout>
          {/* Transactions */}
          <Transactions />
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
        "send",
        "addressBook"
      ]))
    }
  }
}

export default TreasyryTransactions
