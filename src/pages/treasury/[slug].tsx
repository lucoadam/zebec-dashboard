import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/layouts/Layout";
import { Button } from "../../components/shared";
import * as Icons from "../../assets/icons";
import NavLink from "components/layouts/NavLink";
import TreasuryDetail from "components/treasury/detail/TreasuryDetail";

const Treasury: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Layout pageTitle="Zebec - Treasury">
      <div className="pt-[76px]">
        <div className="container">
          <div className="flex justify-between items-center pb-[24px]">
          <div className="flex justify-center items-center px-[1.3rem] pt-2 pb-4">
          <NavLink
              path="/treasury"
              name=""
              type="link"
              Icon={Icons.LeftArrowIcon}
            />
            <h4 className="text-heading-4 font-semibold text-content-primary">
              Zebec Safe
            </h4>
            </div>
            <div className="flex gap-x-3">
                <Button
                  title="Send from Treasury"
                  variant="gradient"
                  endIcon={Icons.ArrowUpRightIcon}
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
      ...(await serverSideTranslations(locale, ["common", "treasury"])),
    },
  };
}

export default Treasury;
