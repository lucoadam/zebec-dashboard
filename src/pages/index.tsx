import { useAppDispatch } from "app/hooks";
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice";
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice";
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import Layout from "../components/layouts/Layout";

const Home: NextPage = () => {
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTokens());
    setTimeout(() => {
      dispatch(
        fetchZebecBalance("vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg")
      );
      dispatch(
        fetchTreasuryBalance({
          name: "my treasury",
          address: "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg",
        })
      );
    }, 1000);
  }, [dispatch]);
  return (
    <Layout pageTitle="Zebec">
      <h1 className="text-5xl text-red-500 font-bold underline">
        {t("greeting")}
      </h1>
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

export default Home;
