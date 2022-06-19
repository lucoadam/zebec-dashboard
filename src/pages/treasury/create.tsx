import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LeftArrowIcon } from "../../assets/icons";
import Layout from "../../components/layouts/Layout";
import NavLink from "../../components/layouts/NavLink";
import CreateTreasury from "../../components/treasury/create/CreateTreasury";

const CreateTreasuryPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Layout pageTitle="Zebec - Create Treasury">
      <div className="pt-[76px]">
        <div className="container w-full">
          <div className="flex justify-start items-center px-3.5 pb-9">
            <NavLink
              path="/treasury"
              name=""
              type="link"
              Icon={LeftArrowIcon}
            />

            <h4 className="text-heading-4 font-semibold text-content-primary">
              {`${t("common:create-new")} ${t("treasury:title")}`}
            </h4>
          </div>
          <CreateTreasury/>
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

export default CreateTreasuryPage;
