import * as Icons from "assets/icons"
import Layout from "components/layouts/Layout"
import { Breadcrumb, BreadcrumbRightContent, Button } from "components/shared"
import TreasuryLists from "components/treasury/TreasuryLists"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Link from "next/link"

const Treasury: NextPage = () => {
  const { t } = useTranslation()

  return (
    <Layout pageTitle="Zebec - Treasury">
      <div className="pt-[76px]">
        <div className="container">
          <Breadcrumb title={`${t("treasury:title")}`} className="mb-9">
            <BreadcrumbRightContent>
              <div className="flex gap-x-3">
                <Link href="/treasury/create">
                  <Button
                    title={`${t("treasury:create-new-treasury")}`}
                    variant="gradient"
                    endIcon={<Icons.PlusIncircleIcon />}
                  />
                </Link>
                <Link href="/treasury/archived-safes">
                  <Button
                    title={`${t("treasury:see-archived-safe")}`}
                    endIcon={<Icons.TrashIcon />}
                  />
                </Link>
              </div>
            </BreadcrumbRightContent>
          </Breadcrumb>

          {/* Treasury Lists */}
          <TreasuryLists />
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "treasury"]))
    }
  }
}

export default Treasury
