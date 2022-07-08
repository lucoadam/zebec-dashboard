import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import * as Icons from "../../assets/icons";
import Layout from "../../components/layouts/Layout";
import { Button } from "../../components/shared";
import TreasuryLists from "../../components/treasury/TreasuryLists";

const Treasury: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Layout pageTitle="Zebec - Treasury">
      <div className="pt-[76px]">
        <div className="container">
          <div className="flex justify-between items-center px-3.5 pb-9">
            <h4 className="text-heading-4 font-semibold text-content-primary">
              {t("treasury:title")}
            </h4>
            <div className="flex gap-x-3">
              <Link href="/treasury/create">
                <Button
                title="Create New Treasury"
                variant="gradient"
                endIcon={<Icons.PlusIncircleIcon />}
              />
              </Link>              
              <Button title="See Archived Safe" endIcon={<Icons.TrashIcon />} />
            </div>
          </div>
          <TreasuryLists />
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "treasury"])),
    },
  };
}

export default Treasury;
