import { useAppDispatch } from "app/hooks";
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice";
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice";
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice";
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
        fetchWalletBalance("22fY53fd1PYwh8ZJS2iEwH72s6P1cT8oFjcSpp5atczv")
      );
      dispatch(
        fetchZebecBalance("22fY53fd1PYwh8ZJS2iEwH72s6P1cT8oFjcSpp5atczv")
      );
      dispatch(
        fetchTreasuryBalance({
          name: "my treasury",
          address: "DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf",
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
