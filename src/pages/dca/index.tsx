import * as Icons from "assets/icons"
import DcaLists from "components/dca/DcaLists"
import Layout from "components/layouts/Layout"
import { Breadcrumb, BreadcrumbRightContent, Button } from "components/shared"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Link from "next/link"

const Treasury: NextPage = () => {
  const { t } = useTranslation()

  return (
    <Layout pageTitle="Zebec - DCA">
      <div className="pt-[76px]">
        <div className="container">
          <Breadcrumb title={`${t("dca:title")}`} className="mb-9 lg:flex ">
            <BreadcrumbRightContent>
              <div className="flex flex-wrap gap-x-3 pt-4 md:pt-0">
                <Link href="/dca/canceled-dca">
                  <Button
                    title={`${t("dca:see-canceled-dca")}`}
                    endIcon={<Icons.TrashIcon />}
                    className="mt-4  md:mt-0"
                  />
                </Link>
                <Link href="/dca/create">
                  <Button
                    title={`${t("dca:create-new-dca")}`}
                    variant="gradient"
                    className="mt-4  md:mt-0"
                    endIcon={<Icons.PlusIncircleIcon />}
                  />
                </Link>
              </div>
            </BreadcrumbRightContent>
          </Breadcrumb>

          {/* Treasury Lists */}
          <DcaLists />
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "dca", "validation"]))
    }
  }
}

export default Treasury
