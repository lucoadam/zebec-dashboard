import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/layouts/Layout";
import { Button, IconButton } from "../../components/shared";
import * as Icons from "../../assets/icons";
import TreasuryDetail from "components/treasury/detail/TreasuryDetail";
import Link from "next/link";
import { useRouter } from "next/router";

const Treasury: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Layout pageTitle="Zebec - Treasury">
      <div className="pt-[76px]">
        <div className="container">
          <div className="flex justify-between items-center pb-[24px]">
          <div className="flex justify-start items-center px-[1.9rem]">
            <IconButton
              onClick={() => {
                router.push("/treasury");
              }}
              variant="plain"
              icon={
                <Icons.LeftArrowIcon className="cursor-pointer w-[18px] h-[16px] mr-[19px]" />
              }
            />

            <h4 className="text-heading-4 font-semibold text-content-primary">
              Zebec Safe
            </h4>
          </div>
            <div className="flex gap-x-3">
              <Button
                title="Send from Treasury"
                variant="gradient"
                endIcon={<Icons.ArrowUpRightIcon />}
              />
            </div>
          </div>
          <TreasuryDetail />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "treasury",
        "treasuryOverview",
        "treasurySettings",
        "validation"
      ])),
    },
  };
}

export default Treasury;
