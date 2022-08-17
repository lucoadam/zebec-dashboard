import { PageNotFoundImage } from "assets/images"
import Layout from "components/layouts/Layout"
import { Button } from "components/shared"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Link from "next/link"

const PageNotFound: NextPage = () => {
  const { t } = useTranslation()
  return (
    <Layout pageTitle="Zebec">
      <div className="container grid place-content-center place-items-center h-[calc(100vh-185px)]">
        <PageNotFoundImage className="w-[200px] h-[200px]" />
        <p className="text-center text-content-primary text-[18px] mt-2 leading-7">
          {t("page-not-found-message")}
        </p>
        <Link href="/">
          <Button
            title={`${t("buttons.go-to-homepage")}`}
            variant="gradient"
            className="mt-8"
          />
        </Link>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"]))
    }
  }
}

export default PageNotFound
