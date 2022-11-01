import Setting from "components/treasury/detail/components/settings/Setting"
import TreasuryDetailsLayout from "components/treasury/detail/TreasuryDetailsLayout"
import TreasuryLayout from "components/treasury/detail/TreasuryLayout"
import { NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const TreasyrySettings: NextPage = () => {
  return (
    <>
      <TreasuryLayout pageTitle="Zebec - Treasury Settings">
        <TreasuryDetailsLayout>
          {/* Settings */}
          <Setting />
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

export default TreasyrySettings
