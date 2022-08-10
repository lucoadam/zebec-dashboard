import { useAppDispatch, useAppSelector } from "app/hooks"
import HomePage from "components/home"
import Layout from "components/layouts/Layout"
import { fetchTokensPrice } from "features/tokenDetails/tokenDetailsSlice"
import type { GetStaticProps, NextPage } from "next"
// import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useEffect } from "react"

const Home: NextPage = () => {
  // const { t } = useTranslation("common")
  const dispatch = useAppDispatch()
  const tokens = useAppSelector(state => state.tokenDetails.tokens)
  useEffect(() => {
    if (tokens.length > 0) {
      dispatch(fetchTokensPrice())
      const interval = setInterval(() => {
        dispatch(fetchTokensPrice())
      }, 30000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [dispatch, tokens])

  return (
    <Layout pageTitle="Zebec">
      <div className="container pt-10">
        <HomePage />
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "home",
        "treasuryOverview",
        "transactions",
        "validation"
      ]))
    }
  }
}

export default Home
