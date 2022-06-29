import { IconButton } from "components/shared";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { LeftArrowIcon } from "../../assets/icons";
import Layout from "../../components/layouts/Layout";
import CreateTreasury from "../../components/treasury/create/CreateTreasury";

const CreateTreasuryPage: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Layout pageTitle="Zebec - Create Treasury">
      <div className="pt-[76px]">
        <div className="container w-full">
          <div className="flex justify-start items-center px-3.5 pb-9">
            <IconButton
              onClick={() => {
                router.push("/treasury");
              }}
              variant="plain"
              icon={
                <LeftArrowIcon className="cursor-pointer w-[18px] h-[16px] mr-[19px]" />
              }
            />

            <h4 className="text-heading-4 font-semibold text-content-primary">
              {`${t("common:create-new")} ${t("treasury:title")}`}
            </h4>
          </div>
          <CreateTreasury />
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "treasury",
        "createTreasury",
        "validation",
      ])),
    },
  };
}

export default CreateTreasuryPage;
