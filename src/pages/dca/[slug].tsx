import * as Icons from "assets/icons"
import DCADetails from "components/dca/detail/DCADetails"
import Layout from "components/layouts/Layout"
import { Breadcrumb, BreadcrumbRightContent, Button } from "components/shared"
import { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

interface GeneralObject {
  [key: string]: string
}

const DCA: NextPage<{
  params: GeneralObject
}> = ({ params }) => {
  const { t } = useTranslation()
  return (
    <Layout pageTitle={`${params?.slug ?? ""} | DCA`}>
      <div className="pt-[76px]">
        <div className="container">
          <Breadcrumb
            title={params?.slug ?? "DCA"}
            arrowBack={true}
            className="md:flex"
          >
            <BreadcrumbRightContent>
              <Button
                title={`${t("dca:buttons.cancel-dca")}`}
                endIcon={<Icons.CrossIcon />}
              />
            </BreadcrumbRightContent>
          </Breadcrumb>
          <DCADetails />
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({
  locale,
  params
}: {
  locale: string
  params: GeneralObject
}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "dca"])),
      params
    }
  }
}

export default DCA
