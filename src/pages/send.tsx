import { useAppSelector } from "app/hooks"
import Layout from "components/layouts/Layout"
import { ContinuousStream } from "components/send/continuousStream"
import { ContinuousStreamFormData } from "components/send/continuousStream.d"
import type { NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useState } from "react"
import { StreamOverview } from "components/send/streamOverview"

const Send: NextPage = () => {
  const [formValues, setFormValues] = useState<ContinuousStreamFormData>()
  const zebecBalance = useAppSelector((state) => state.zebecBalance.tokens)
  return (
    <Layout pageTitle="Zebec">
      <div className="py-16 container">
        <div className="grid md:grid-cols-2">
          <div className="w-full">
            <ContinuousStream
              setFormValues={setFormValues}
              tokenBalances={zebecBalance}
            />
          </div>
          <StreamOverview formValues={formValues} />
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
