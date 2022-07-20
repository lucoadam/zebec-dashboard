import { useAppDispatch, useAppSelector } from "app/hooks"
import Layout from "components/layouts/Layout"
import { ContinuousStream } from "components/send/ContinuousStream"
import { ContinuousStreamFormData } from "components/send/ContinuousStream.d"
import type { NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useEffect, useState } from "react"
import { StreamOverview } from "components/send/StreamOverview"
import { fetchTokensPrice } from "features/tokenDetails/tokenDetailsSlice"

const Send: NextPage = () => {
  const [formValues, setFormValues] = useState<ContinuousStreamFormData>()
  const zebecBalance = useAppSelector((state) => state.zebecBalance.tokens)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTokensPrice())
    const interval = setInterval(() => {
      dispatch(fetchTokensPrice())
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  return (
    <Layout pageTitle="Zebec">
      <div className="py-16 container">
        <div className="grid lg:flex">
          <ContinuousStream
            setFormValues={setFormValues}
            tokenBalances={zebecBalance}
            className="w-full lg:w-[628px]"
          />
          <StreamOverview className="lg:ml-[79px]" formValues={formValues} />
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
        "validation",
        "send"
      ]))
    }
  }
}

export default Send
