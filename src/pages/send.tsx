import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import Layout from "components/layouts/Layout"
import { ContinuousStream } from "components/send/continuousStream"
import { ContinuousStreamFormData } from "components/send/continuousStream.d"
import { Button } from "components/shared"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useState } from "react"
import { toSubstring } from "utils"

const Send: NextPage = () => {
  const { t } = useTranslation("common")
  const [formValues, setFormValues] = useState<ContinuousStreamFormData>()
  const walletTokens = useAppSelector((state) => state.walletBalance.tokens)
  return (
    <Layout pageTitle="Zebec">
      <div className="py-16 container">
        <div className="grid md:grid-cols-2">
          <div className="w-full">
            <ContinuousStream
              setFormValues={setFormValues}
              tokenBalances={walletTokens}
            />
          </div>
          <div className="p-10 flex flex-col justify-center text-content-primary w-[400px]">
            <div className="border-dashed border-b pb-4 border-outline">
              <h1 className="text-base font-semibold">
                {t("send:stream-overview")}
              </h1>
            </div>
            <div className="mt-4 pt-4">
              <p className="text-subtitle text-content-secondary">
                {t("send:stream-start-details")}{" "}
                <span className="text-content-primary">
                  {formValues?.startDate || "..."}{" "}
                  {formValues?.startTime || "..."}
                </span>
              </p>
              <p className="mt-2 text-subtitle text-content-secondary">
                <span className="text-content-primary">
                  {formValues?.tokenAmount || formValues?.amount || "..."}{" "}
                  {formValues?.token || "..."}{" "}
                </span>
                {t("send:token-amount-details")}{" "}
                <span className="text-content-primary">
                  {" "}
                  {toSubstring(formValues?.receiverWallet, 12, false)}
                </span>
              </p>
              {(formValues?.noOfTimes ||
                formValues?.tokenAmount ||
                formValues?.interval) && (
                <p className="text-subtitle text-content-secondary">
                  {t("send:for")}{" "}
                  <span className="text-content-primary">
                    {formValues?.noOfTimes || "..."}{" "}
                    {formValues?.interval || "..."}.{" "}
                    {formValues?.amount || "..."} {formValues?.token || "..."}
                  </span>{" "}
                  {t("send:in-total")}
                </p>
              )}
              <p className="mt-2 text-subtitle text-content-secondary">
                {t("send:stream-end-details")}{" "}
                <span className="text-content-primary">
                  {formValues?.endDate || "..."} {formValues?.endTime || "..."}
                </span>
              </p>
            </div>
            <div className="mt-4 border border-outline p-4 rounded-md">
              <div className="text-subtitle text-content-primary">
                {t("send:streaming-help")}
              </div>
              <span className="text-content-tertiary text-subtitle">
                {t("send:streaming-help-details")}
              </span>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="default"
                  size="small"
                  title={t("send:check-faq")}
                  endIcon={<Icons.OutsideLinkIcon />}
                />
                <Button
                  variant="default"
                  size="small"
                  title={t("send:join-discord")}
                  endIcon={<Icons.OutsideLinkIcon />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }: any) {
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
