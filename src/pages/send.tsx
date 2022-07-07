import * as Icons from "assets/icons";
import Layout from "components/layouts/Layout";
import ContinuousStream from "components/send/continuousStream";
import { Button } from "components/shared";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Send: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <Layout pageTitle="Zebec">
      <div className="py-16 container">
        <div className="grid md:grid-cols-2">
          <div className="w-full">
            <ContinuousStream/>
          </div>
          <div className="p-10 flex flex-col justify-center text-content-primary w-[400px]">
            <div className="border-dashed border-b pb-4 border-outline">
              <h1 className="text-base font-semibold">Steam Overview</h1>
            </div>
            <div className="mt-4 pt-4">
              <p className="text-subtitle text-content-secondary">
                Stream starts on <span className="text-content-primary">07/04/2022 12:00 AM</span>
              </p>
              <p className="mt-2 text-subtitle text-content-secondary">
                <span className="text-content-primary">0 SOL</span>
                will be sent to
                <span className="text-content-primary">..........</span>
              </p>
              <p className="text-subtitle text-content-secondary">
                for <span className="text-content-primary">0 days. 0 SOL</span> in total.
              </p>
              <p className="mt-2 text-subtitle text-content-secondary">
                Stream will end on <span className="text-content-primary">10/04/2022 12:00 AM</span>
              </p>
            </div>
            <div className="mt-4 border border-outline p-4 rounded-md">
              <div className="text-subtitle text-content-primary">
                Streaming Help
              </div>
              <span className="text-content-tertiary text-subtitle">
                Browse through our support articles to learn to stream or lets get in touch through Discord.
              </span>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="default"
                  size="small"
                  title="Check FAQs"
                  endIcon={<Icons.OutsideLinkIcon/>}
                  />
                <Button
                  variant="default"
                  size="small"
                  title="Join Discord"
                  endIcon={<Icons.OutsideLinkIcon/>}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
export default Send;
